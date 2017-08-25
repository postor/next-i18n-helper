# next-i18n-helper

让next.js的多国语言更方便 

# 使用方法

安装

```
npm install next-i18n-helper --save
```

components/i18n.js -- 配置你的多国语言

```
import I18nHelper from 'next-i18n-helper'
import getWrapper from 'next-i18n-helper/dist/wrapper'

export const i18nHelper = new I18nHelper({
  defaultLang: 'zh',
  supportLangs: ['en','zh']
})

export const wrapper = getWrapper(i18nHelper)
```

pages/index.js -- 需要翻译的页面

```

import { translate } from 'react-i18next'
import { wrapper } from '../components/i18n'
import Header from '../components/Header'

const translateNS = ['index']

const Index = (props) => {
  const { t } = props

  return (<div>
    <Header />
    <h1>{t('My Blog')}</h1>
    <p>
      <a>{t('See my posts')} >></a>
    </p>
    <p>
      <a>{t('See my first post')} >></a>
    </p>

  </div>)
}

Index.translateNS = [...translateNS, ...Header.translateNS]

export default wrapper(translate(translateNS)(Index))
```

components/Header.js -- 需要翻译的公共模块，以及如何更改当前语言

```
import { translate } from 'react-i18next'
import { i18nHelper } from '../components/i18n'

const translateNS = ['common']

const Header = (props) => (<p>
  current page is <strong>{props.t('Home')}</strong>
  <select value={i18nHelper.getCurrentLanguage()} onChange={(e) =>
    i18nHelper.setCurrentLanguage(e.target.value)
  }>
    <option value="en">English</option>
    <option value="zh">中文</option>
  </select>
</p>)

Header.translateNS = translateNS

export default translate(translateNS)(Header)
```

## 配置参数说明

```
export const i18nHelper = new I18nHelper({
  defaultLang: 'zh',
  supportLangs: ['en','zh']
})
```

```
/**
 * I18nHelper
 */
export default class I18nHelper {

  /**
   * Creates an instance of I18nHelper.
   * @param {Object} opt
   * @param {string} [opt.defaultLang = 'en'] default language
   * @param {string[]} [opt.supportLangs = ['en']] support languages
   * @param {string} [opt.langCookieName = 'lang'] cookie to remember selected language
   * @param {number} [opt.langCookieExpire = 365] cookie expires in xxx days
   * @param {string} [opt.localesBaseUrl = '/static/locales'] locale file location
   * @param {Object} [opt.i18nOption] to extend i18next config 
   * @param {module[]} [opt.plugins] i18next plugins, default cache and xhr for browser side
   * @memberof I18nHelper
   */
  constructor(opt = {}) {
    ...
```


## 例子
简单使用 [example](./example) 

demo页面: http://nextjs.i18ntech.com/ 

demo代码: https://github.com/nextjs-boilerplate/bootstrap
