# next-i18n-helper

make i18next easier to work in both server side and client side

# usage

install

```
npm install next-i18n-helper --save
```

i18n-helper.js

```
import I18nHelper from 'next-i18n-helper'
export default new I18nHelper({
  supportLangs: ['en','zh']
})
```

react top component

```
import i18nHelper from './i18n-helper.js'

export class Layout extends React.Component {  
  constructor(props) {
    super(props)
    
    //props.translations 来自 this.getInitialProps    
    this.i18n = i18nHelper.getI18n(props.translations)
  }
  render(){
    return <I18nextProvider i18n={this.i18n}>
      <Header />
      <App />
    </I18nextProvider>
  }

  //next.js getInitialProps
  static async getInitialProps (ctx) {
    var translations = await getTranslation(i18nHelper.getCurrentLanguage(),ctx.req)
    return {translations}
  }
}

//prepare translation data for server side rendering
function async getTranslation(lang, req){
  var trans = {
    zh: {
      common: {
        haha: '哈哈'
      }
    }
  }
  return Promise.resolve(trans)
}
```

translate

```
import { translate } from 'react-i18next';
class Header extends React.Component {
  render(){
    const { t } = this.props
    return (<div>{t('haha')}</div>)
  }
}  
export default translate(['common'])(Header)
```


change language

```
import i18nHelper from './i18n-helper.js'
class Header extends React.Component {
  render(){
    return (<select value={i18nHelper.getCurrentLanguage()} onChange={that.handleChangeLanguage.bind(that)}>
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>)
  }

  handleChangeLanguage(e){
    i18nHelper.setCurrentLanguage(e.target.value);
  }
}  

```

full example see https://github.com/nextjs-boilerplate/next.js-boilerplate