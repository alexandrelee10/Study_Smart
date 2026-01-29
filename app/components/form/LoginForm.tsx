import React from 'react'
import Image from 'next/image'
import studyPic from '@/public/assets/signin/study.png'

const LoginForm = () => {
  return (
    <section id=''>
        <div>
            {/* Left */}
            <div>
                <Image 
                src={studyPic}
                alt='side image'
                />
            </div>
            {/* Right */}
            <div>
                
            </div>
        </div>
    </section>
  )
}

export default LoginForm
