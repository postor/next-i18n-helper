import { useState } from 'react'
import translate from '../src/translate'
import Link from 'next/link'
import { i18nHelper } from '../components/i18n'

const translateNS = ['common']
const style = { margin: '0 10px' }

const Header = () => {
  const [lang, setLang] = useState(i18nHelper.getCurrentLanguage())

  return (<p>
    <Link href="/"><a style={style}>home</a></Link>
    <Link href="/posts"><a style={style}>posts</a></Link>
    <select style={style} value={lang} onChange={(e) => {
      setLang(e.target.value)
      i18nHelper.setCurrentLanguage(e.target.value)
    }}>
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  </p>)
}

const TranslatedHeader = translate(translateNS)(Header)
TranslatedHeader.translateNS = translateNS

export default TranslatedHeader