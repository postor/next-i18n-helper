import React from 'react'
import getTranslation from './get-translation'
import I18nHelper from './index'

export default (i18nHelper = new I18nHelper) => (Page, ns) => {

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
        const ns = [...new Set(ns || Page.translateNS)]
        i18nHelper.init({
          translations,
          lang,
          ns
        })
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
      const translateNS = [...new Set(ns || Page.translateNS)]
      // console.log(translateNS)
      const lang = i18nHelper.getCurrentLanguageFromReq(ctx.req)
      const translations = await getTranslation(i18nHelper.localesBaseUrl)(
        lang,
        translateNS,
        ctx.req
      )
      // console.log(lang)
      await i18nHelper.init({
        resources: translations,
        lng: lang,
        ns: translateNS
      })
      // console.log({lang})
      return {
        pageInitialProps,
        translations,
        lang,
      }
    }

    render() {
      const pageInitialProps = { ...this.pageInitialProps, ...this.props.pageInitialProps }
      return (<Page {...pageInitialProps} />)
    }

  }

  return Wrapper
}
