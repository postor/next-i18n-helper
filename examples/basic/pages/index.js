
import translate from 'next-i18n-helper/dist/translate'
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

const TIndex = translate(translateNS)(Index)
TIndex.translateNS = [...translateNS, ...Header.translateNS]

export default wrapper(TIndex)