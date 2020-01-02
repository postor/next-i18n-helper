import React, { useContext } from 'react'
import I18nContext from './I18nContext'
import { withTranslation } from 'react-i18next'

const serverT = (ns) => (Comp) => {
  const Translated = (props) => {
    const { i18n, lng } = useContext(I18nContext)
    const t = i18n.getFixedT(lng, ns)
    return (<Comp {...props} t={t} lng={lng} i18n={i18n} />)
  }
  return Translated
}

export default typeof window === 'undefined' ? serverT : withTranslation