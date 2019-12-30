import I18nHelper from '../../dist/index'
import getWrapper from '../../dist/wrapper'

export const i18nHelper = new I18nHelper({
  defaultLang: 'zh',
  supportLangs: ['en', 'zh']
})

export const wrapper = getWrapper(i18nHelper)