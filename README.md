# next-i18n-helper

make i18next easier to work in both server side and client side

# usage

install

```
npm install next-i18n-helper --save
```

components/i18n.js -- config your i18n

```
import I18nHelper from 'next-i18n-helper'
import getWrapper from 'next-i18n-helper/dist/wrapper'

export const i18nHelper = new I18nHelper({
  defaultLang: 'zh',
  supportLangs: ['en','zh']
})

export const wrapper = getWrapper(i18nHelper)
```

pages/index.js -- page need to translate

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

components/Header.js -- component translate and change language

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

full example see [example](./example) 