import Cookies from 'js-cookie'
import locale from 'locale'
import i18n from 'i18next'
import XHR from 'i18next-xhr-backend'


const isServerSide = (typeof window === 'undefined')

/**
 * 多国语言帮助类
 */
export default class I18nHelper {
  
  /**
   * Creates an instance of I18nHelper.
   * @param {Object} opt
   * @param {string} [opt.defaultLang = 'en'] 默认语言
   * @param {string[]} [opt.supportLangs = ['en']] 支持的语言
   * @param {string} [opt.langCookieName = 'lang'] 使用cookie名
   * @param {number} [opt.langCookieExpire = 365] cookie过期时间（天）
   * @param {Object} [opt.i18nXHROption = {loadPath: '/static/locales/{{lng}}/{{ns}}.json',addPath: '/static/locales/{{lng}}/{{ns}}.json',}]
   * @memberof I18nHelper
   */
  constructor(opt = {}) {
    const { 
      defaultLang = 'en', 
      supportLangs = ['en'], 
      langCookieName = 'lang',
      langCookieExpire = 365, 
      i18nXHROption =  {
        loadPath: '/static/locales/{{lng}}/{{ns}}.json',
        addPath: '/static/locales/{{lng}}/{{ns}}.json',
      },
    } = opt

    this.defaultLang = defaultLang
    this.supportLangs = supportLangs
    this.langCookieName = langCookieName
    this.langCookieExpire = langCookieExpire
    this.i18nXHROption = i18nXHROption

    
    this.i18n = null
    this.currentLang = null
  }


  /**
   * 获取当前语言，判定顺序：cookie（req.cookies或document.cookie）->browser（req.headers["accept-language"]或navigator.language || navigator.userLanguage）
   * @param {Request} req Request 对象来自express 
   * @return {string}
   */
  getCurrentLanguage(req) {
    var getCurrentLang = ()=>{
      //from cookie
      var fromCookie = req ? req.cookies[this.langCookieName] : Cookies.get(this.langCookieName)
      
      if (this.supportLangs.includes(fromCookie)) return fromCookie

      var supported = new locale.Locales(this.supportLangs, this.defaultLang)
      if (req) {
        var locales = new locale.Locales(req.headers["accept-language"])
        return locales.best(supported).language
      } else {
        var locales = new locale.Locales(navigator.language || navigator.userLanguage)
        return locales.best(supported).language
      }
    }
    
    (req || !this.currentLang) && (this.currentLang = getCurrentLang())

    return this.currentLang
  }

  /**
   * 设置cookie（只会在客户端发生）
   * @param {string} lang 
   * @param {instance of I18n} i18n
   * @param {Object} langData
   */
  setCurrentLanguage(lang) {
    if(isServerSide) return
    Cookies.set(this.langCookieName, lang, { expires: this.langCookieExpire })
    this.i18n.changeLanguage(lang)
    this.currentLang = lang
  }

  /**
   * 清除cookie
   */
  clearCurrentLanguage() {
    Cookies.remove(this.langCookieName)
    this.currentLang = null
  }  

  /**
   * 获取初始化的i18n实例，server side始终新建，客户端单例模式
   * @param {any} translationData 
   * @returns {instance of I18next}
   */
  getI18n(translationData){
    const that = this
    if(isServerSide) return innerGetI18n()

    if(this.i18n) return this.i18n

    this.i18n = innerGetI18n()
    return this.i18n

    function innerGetI18n(){
      var ns = ['common']
      translationData && translationData[that.currentLang] && (ns = Object.keys(translationData[that.currentLang])) 
      var options = {
        lng: that.getCurrentLanguage(), // active language http://i18next.com/translate/
        fallbackLng: that.defaultLang,
        resources: isServerSide?translationData:undefined,
        ns,
        defaultNS: 'common',
        debug: false,
        initImmediate: isServerSide,
      }

      var i18nInstance = i18n
      .use(XHR)
      .init(
        {
          ...options,
          backend: that.i18nXHROption
        }
      )

      translationData && Object.keys(translationData).forEach((lang)=>{
        Object.keys(translationData[lang]).forEach((ns)=>{          
          i18nInstance.addResourceBundle(lang,ns,translationData[lang][ns])
        })
      })

      return i18nInstance
    }
    
  }
}