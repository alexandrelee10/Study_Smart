import Image from 'next/image'
import React from 'react'
import HeroPage from './components/Hero'
import TrustedByPage from './components/TrustedBy'

const HomePage = () => {
  return (
    <div className=''>
      <HeroPage />
      <TrustedByPage />
    </div>
  )
}

export default HomePage