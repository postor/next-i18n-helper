import React from 'react'
import i18next from 'i18next'
import getTranslation from './get-translation'
import I18nHelper from './index'
import I18nContext from './I18nContext'
import OneTimeStore from './OneTimeStore'
import { initReactI18next } from 'react-i18next'

const isServerSide = (typeof window === 'undefined')
const i18nCache = new OneTimeStore()

const wrapper = (i18nHelper = new I18nHelper) => (Page, ns1) => {

  class Wrapper extends React.Component {
    constructor(props) {
      super(props)
      const {
        pageInitialProps = {},
        translations,
        lang,
      } = props
      this.pageInitialProps = {
        ...props,
        ...pageInitialProps
      }
      if (!i18nHelper.inited) {
        const ns = [...new Set(ns1 || Page.translateNS)]
        i18nHelper.init({
          translations,
          lang,
          ns
        })
        if (!isServerSide) initReactI18next.init(i18nHelper.i18n)
      }
      delete this.pageInitialProps.pageInitialProps
      delete this.pageInitialProps.translations
    }

    static async getInitialProps(ctx) {
      var pageInitialProps = {}
      Page.getInitialProps && (pageInitialProps = await Page.getInitialProps(ctx))

      // 前台直接返回
      if (!ctx.req) return { pageInitialProps }

      //translation
      const translateNS = [...new Set(ns1 || Page.translateNS)]
      const lang = i18nHelper.getCurrentLanguageFromReq(ctx.req)
      console.log({ lang })
      const translations = await getTranslation(i18nHelper.localesBaseUrl)(
        lang,
        translateNS,
        ctx.req
      )
      const i18n = i18next.createInstance()
      await i18n.init({
        lng: lang,
        resources: translations,
        ns: translateNS,
        // debug: true,
        // overloadTranslationOptionHandler: (...args) => (console.log(args), ({})),
      })

      const i18nRef = i18nCache.set(i18n)

      return {
        pageInitialProps,
        lang,
        translations,
        i18nRef,
      }
    }

    render() {
      const pageInitialProps = { ...this.pageInitialProps, ...this.props.pageInitialProps }
      if (!isServerSide) return (<I18nContext.Provider value={{
        i18n: i18nHelper.i18n,
        lng: i18nHelper.currentLang,
      }}><Page {...pageInitialProps} /></I18nContext.Provider>)

      const i18n = i18nCache.get(this.props.i18nRef)
      // console.log(i18n)
      return (<I18nContext.Provider value={{
        i18n,
        lng: this.props.lang,
      }}><Page {...pageInitialProps} /></I18nContext.Provider>)
    }

  }
  return Wrapper
}
export default wrapper