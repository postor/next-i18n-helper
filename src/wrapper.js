import React from 'react'
import { I18nextProvider } from 'react-i18next'
import getTranslation from './get-translation'

export default (i18nHelper) => (Page) => class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    const { translations, pageInitialProps = {} } = props
    this.i18n = i18nHelper.getI18n(translations)
    this.pageInitialProps = {
      ...props,
      ...pageInitialProps
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
    var translateNS = [...Page.translateNS || []].filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    })

    var translations = await getTranslation(i18nHelper.localesBaseUrl)(
      i18nHelper.getCurrentLanguage(ctx.req),
      translateNS,
      ctx.req
    )

    return {
      translations,
      pageInitialProps
    }
  }

  render() {
    const pageInitialProps = { ...this.pageInitialProps, ...this.props.pageInitialProps }
    return <I18nextProvider i18n={this.i18n}>
      <Page {...pageInitialProps} />
    </I18nextProvider>
  }
}