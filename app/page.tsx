import HeroPage from './components/Hero'
import TrustedByPage from './components/TrustedBy'
import AboutUsPage from './components/AboutUs'
import GetStartedPage from './components/GetStarted'
import FooterPage from './components/Footer'
import FAQPage from './components/FAQ'
import TryForFree from './components/TryForFree'
import Reveal from './components/Reveal'

const HomePage = () => {
  return (
    <div>
      <Reveal><HeroPage /></Reveal>
      <Reveal delay={0.05}><TrustedByPage /></Reveal>
      <Reveal delay={0.1}><AboutUsPage /></Reveal>
      <Reveal delay={0.15}><GetStartedPage /></Reveal>
      <Reveal delay={0.2}><TryForFree /></Reveal>
      <Reveal delay={0.25}><FAQPage /></Reveal>
      <Reveal delay={0.3}><FooterPage /></Reveal>
    </div>
  )
}

export default HomePage