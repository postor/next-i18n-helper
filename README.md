# next-i18n-helper

i18n for next.js | 给 next.js 适配多国语言

quick glance: https://www.youtube.com/watch?v=npC7orrLsvE&list=PLM1v95K5B1ntVsYvNJIxgRPppngrO_X4s

# usage | 使用

install | 安装

```
npm install next-i18n-helper --save
```

[components/i18n.js](./examples/basic/components/i18n.js) -- config your i18n | 配置你的 i18n

```
import I18nHelper from 'next-i18n-helper'
import getWrapper from 'next-i18n-helper/dist/wrapper'

export const i18nHelper = new I18nHelper({
  defaultLang: 'en',  // 默认语言
  supportLangs: ['en','zh'] // 支持的语言列表
})

export const wrapper = getWrapper(i18nHelper)
```


[`server.js`](./examples/basic/`server.js`) 

```
...
const cookieParser = require('cookie-parser')
...

app.prepare()
  .then(() => {
    const server = express()
    server.use(cookieParser()) // next-i18n-helper use cookie to store user choose language | 使用 cookie 保存用户所选语言
    server.use('/static', express.static('public')) // publish your translation for xhr translate | 用于 xhr 翻译

    server.get('*', (req, res) => {
      return handle(req, res)
    })
    ...    
  })
```

### basic

refer [basic](./examples/basic) | 参考 [basic](./examples/basic)

[pages/index.js](./examples/basic/pages/index.js)

```
...
import { wrapper } from '../components/i18n'

const translateNS = ['index']

const Index = ({ t }) => (<div>
  <Header />
  <h1>{t('My Blog')}</h1>
  ...
</div>)


const TIndex = translate(translateNS)(Index)
TIndex.translateNS = [...translateNS, ...Header.translateNS]

export default wrapper(TIndex)
```

### with layout | 使用 `_app.js` 

refer [layout](./examples/layout) | 参考 [layout](./examples/layout)

[components/layout.js](./examples/layout/components/layout.js)

```
import { wrapper } from './i18n'
import Header from './Header'
export default (Page) => {

  const Layout = () => (<div>
    <Header />
    <Page />
  </div>)

  return wrapper(Layout, [
    ...Header.translateNS,
    ...Page.translateNS
  ])
}
```

### change language | 切换语言

[components/Header.js](./examples/basic/components/Header.js)

```
import { useState } from 'react'
import { i18nHelper } from '../components/i18n'

const translateNS = ['common']

const Header = () => {
  const [lang, setLang] = useState(i18nHelper.getCurrentLanguage())
  return (<p>
    ...
    <select value={lang} onChange={(e) => {
      i18nHelper.setCurrentLanguage(e.target.value)
      setLang(e.target.value)
    }}>
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
    ...
  </p>)
}

## config | 配置

```
/**
 * I18nHelper
 */
export default class I18nHelper {

  /**
   * Creates an instance of I18nHelper.
   * @param {Object} opt
   * @param {string} [opt.forceInitalLanguage = 'en'] force inital language(cookie=>forceInitalLanguage=>browser-setting=>default)
   * @param {string} [opt.defaultLang = 'en'] default language(cookie=>forceInitalLanguage=>browser-setting=>default)
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
for more refer [src/index.js](./src/index.js)
