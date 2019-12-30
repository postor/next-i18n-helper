
import { wrapper } from '../components/i18n'
import Header from '../components/Header'


function MyApp({ Component, pageProps }) {
  const Page = () => (<div>
    <Header />
    <Component {...pageProps} />
  </div>)
  const WrappedPage = wrapper(Page, [...Header.translateNS, Component.translateNS])
  return (<WrappedPage />)
}

export default MyApp