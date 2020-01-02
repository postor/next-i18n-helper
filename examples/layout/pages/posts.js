

import translate from 'next-i18n-helper/dist/translate'
import layout from '../components/layout'


const translateNS = ['posts']

const Posts = ({ t }) => (<div>
  <h1>{t('My Posts')}!</h1>
  <p>{t('none')} ...</p>
</div>)

const TPosts = translate(translateNS)(Posts)

TPosts.translateNS = [...translateNS]

export default layout(TPosts)