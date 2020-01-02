import { useState } from 'react'
import translate from 'next-i18n-helper/dist/translate'
import { i18nHelper } from '../components/i18n'

const translateNS = ['common']

const Header = ({ t }) => {
  const [lang, setLang] = useState(i18nHelper.getCurrentLanguage())
  return (<p>
    current page is <strong>{t('Home')}</strong>
    <select value={lang} onChange={(e) => {
      i18nHelper.setCurrentLanguage(e.target.value)
      setLang(e.target.value)
    }}>
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  </p>)
}

const TranslatedHeader = translate(translateNS)(Header)
TranslatedHeader.translateNS = translateNS

export default TranslatedHeader