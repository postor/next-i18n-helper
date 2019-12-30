
import { withTranslation as translate } from 'react-i18next'

const translateNS = ['index']

const Index = ({ t }) => (<div>
  <h1>{t('My Blog')}</h1>
  <p>
    <a>{t('See my posts')} >></a>
  </p>
  <p>
    <a>{t('See my first post')} >></a>
  </p>
</div>)

const TIndex = translate(translateNS)(Index)
TIndex.translateNS = translateNS

export default TIndex