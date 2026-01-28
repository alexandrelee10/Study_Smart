import Image from 'next/image'
import React from 'react'
import HeroPage from './components/Hero'
import TrustedByPage from './components/TrustedBy'
import AboutUsPage from './components/AboutUs'
import GetStartedPage from './components/GetStarted'

const HomePage = () => {
  return (
    <div className=''>
      <HeroPage />
      <TrustedByPage />
      <AboutUsPage />
      <GetStartedPage />
    </div>
  )
}

export default HomePage