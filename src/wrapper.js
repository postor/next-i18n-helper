import React from 'react'
import { I18nextProvider } from 'react-i18next'
import getTranslation from './get-translation'

export default (i18nHelper) => (Page) => class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    const { translations, pageInitialProps = {} } = props
    this.i18n = i18nHelper.getI18n(translations)
    this.pageInitialProps = pageInitialProps
  }

  static async getInitialProps(ctx) {
    var pageInitialProps = {}
    Page.getInitialProps && (pageInitialProps = await Page.getInitialProps(ctx))

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
    return <I18nextProvider i18n={this.i18n}>
      <Page {...this.pageInitialProps} />
    </I18nextProvider>
  }
}