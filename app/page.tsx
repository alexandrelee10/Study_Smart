import HeroPage from './components/Hero'
import TrustedByPage from './components/TrustedBy'
import AboutUsPage from './components/AboutUs'
import GetStartedPage from './components/GetStarted'
import FooterPage from './components/Footer'
import FAQPage from './components/FAQ'
import TryForFree from './components/TryForFree'

const HomePage = () => {
  return (
    <div className=''
>
      <HeroPage />
      <TrustedByPage />
      <AboutUsPage />
      <GetStartedPage />
      <TryForFree />      
      <FAQPage />
      <FooterPage />
    </div>
  )
}

export default HomePage