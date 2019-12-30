
import { wrapper } from './i18n'
import Header from './Header'
export default (Page) => {

  const Layout = () => (<div>
    <Header />
    <Page />
  </div>)

  return wrapper(Layout, [...new Set([
    ...Header.translateNS,
    ...Page.translateNS
  ])])
}