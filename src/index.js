import Cookies from 'js-cookie'
import locale from 'locale'
import i18n from 'i18next'
import XHR from 'i18next-xhr-backend'
import cache from 'i18next-localstorage-cache'
import wrapper from './wrapper'

import { initReactI18next } from 'react-i18next'


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
   * @param {string} [opt.localesBaseUrl] 文件的基础位置
   * @param {Object} [opt.i18nOption] 扩展i18n的参数
   * @param {module[]} [opt.plugins] i18n插件，默认xhr和localstorage
   * @memberof I18nHelper
   */
  constructor(opt = {}) {
    const {
      defaultLang = 'en',
      supportLangs = ['en'],
      langCookieName = 'lang',
      langCookieExpire = 365,
      plugins = isServerSide ? [initReactI18next] : [initReactI18next, XHR, cache],
      localesBaseUrl = '/static/locales',
      i18nOption = {
        cache: {
          enabled: true,
          expirationTime: 7 * 24 * 60 * 60 * 1000
        },
        backend: {
          loadPath: `${localesBaseUrl}/{{lng}}/{{ns}}.json`,
          addPath: `${localesBaseUrl}/{{lng}}/{{ns}}.json`,
        }
      },
    } = opt

    this.defaultLang = defaultLang
    this.supportLangs = supportLangs
    this.langCookieName = langCookieName
    this.langCookieExpire = langCookieExpire
    this.i18nOption = i18nOption
    this.plugins = plugins
    this.localesBaseUrl = localesBaseUrl

    this.i18n = null
    this.currentLang = null
  }

  getWrapper() {
    return wrapper(this)
  }


  /**
   * 获取当前语言，判定顺序：cookie（req.cookies或document.cookie）->browser（req.headers["accept-language"]或navigator.language || navigator.userLanguage）
   * @param {Request} req Request 对象来自express 
   * @return {string}
   */
  getCurrentLanguage(req) {
    var that = this
    var getCurrentLang = () => {
      //from cookie
      var fromCookie = req ? (req.cookies ? req.cookies[that.langCookieName] : '') : Cookies.get(that.langCookieName)

      if (that.supportLangs.includes(fromCookie)) return fromCookie

      var supported = new locale.Locales(that.supportLangs, that.defaultLang)
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
    if (isServerSide) return
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
   * @param {any[]} i18nPlugins 
   * @returns {instance of I18next}
   */
  getI18n(translationData, i18nPlugins) {
    const that = this
    if (isServerSide) return innerGetI18n()

    if (this.i18n) return this.i18n

    this.i18n = innerGetI18n()
    return this.i18n

    function innerGetI18n() {
      var ns = ['common']
      translationData && translationData[that.currentLang] && (ns = Object.keys(translationData[that.currentLang]))
      var options = {
        lng: that.getCurrentLanguage(), // active language http://i18next.com/translate/
        fallbackLng: that.defaultLang,
        resources: isServerSide ? translationData : undefined,
        ns,
        defaultNS: 'common',
        debug: false,
        initImmediate: isServerSide,
      }

      var i18nInstance = (i18nPlugins || that.plugins).reduce((i18n, plugin) => {
        return i18n.use(plugin)
      }, i18n)
        .init(
          {
            ...options,
            ...that.i18nOption
          }
        )

      translationData && Object.keys(translationData).forEach((lang) => {
        Object.keys(translationData[lang]).forEach((ns) => {
          i18nInstance.addResourceBundle(lang, ns, translationData[lang][ns])
        })
      })

      return i18nInstance
    }

  }
}