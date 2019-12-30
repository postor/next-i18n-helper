import I18nHelper from 'next-i18n-helper'
import getWrapper from 'next-i18n-helper/dist/wrapper'

export const i18nHelper = new I18nHelper({
  defaultLang: 'en',
  supportLangs: ['en', 'zh']
})

export const wrapper = getWrapper(i18nHelper)