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