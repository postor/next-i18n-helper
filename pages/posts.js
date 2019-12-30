
import { withTranslation as translate } from 'react-i18next'
import { wrapper } from '../components/i18n'

const translateNS = ['posts']

const Posts = ({ t }) => (<div>
  <h1>{t('My Posts')}!</h1>
  <p>{t('none')} ...</p>
</div>)

const TPosts = translate(translateNS)(Posts)

TPosts.translateNS = [...translateNS]

export default wrapper(TPosts)