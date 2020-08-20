
import { wrapper } from './i18n'
import Header from './Header'
const layout = (Page) => {

  const Layout = () => (<div>
    <Header />
    <Page />
  </div>)

  return wrapper(Layout, [...new Set([
    ...Header.translateNS,
    ...Page.translateNS
  ])])
}

export default layout