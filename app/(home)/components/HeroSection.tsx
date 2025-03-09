import React from 'react'
import Link from 'next/link'
import { MovingButton } from '../../../components/ui/moving-border'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <div className='min-h-[90vh] flex flex-col-reverse gap-14 lg:gap-0 lg:flex-row items-center justify-between'>
        <div className='space-y-10 text-center lg:text-left'>
        <h1 className='text-4xl font-bold lg:text-7xl'>Hey👋, I&apos;m Abhishek. <br /> 
        <span className='underline text-center underline-offset-8 decoration-green-500'>
            {"Nice to Meet you!"}
            </span></h1>
        <p className='font-sans font-normal text-justify text-s md:max-w-96 text-neutral-300'>
            {"I’m a passionate full-stack developer with expertise in the MERN stack, dedicated to creating a user-friendly websites. With a strong foundation in HTML, CSS, and JavaScript, I thrive on transforming ideas into innovative solutions. My background in graphic design allows me to blend aesthetics with functionality, ensuring a seamless user experience. I’m also skilled in social media management, helping brands connect authentically with their audience."}
            </p>

        {/* <p className='text-lg'>I'm currently working on a few projects, and I'm always looking for new opportunities.</p> */}

        {/* <Title text='Get in touch 📤'/> */}
        <Link href={"mailto:mailus@mrabhi2k3.me"} className='inline-block '>
        <div>
        </div>
        </Link>
        </div>
        
        <div className='relative'>
            <div className='w-72 h-72 space-y-2 mb-8 -rotate-[0deg] relative'>
                <div className='flex gap-3 translate-x-8'>

                    {/* <div className='w-32 h-32 rounded-2xl bg-green-500'></div>

                    <div className='w-32 h-32 rounded-full bg-indigo-500'></div>
                </div>

                <div className='flex gap-3 translate-x-8'>

                    <div className='w-32 h-32 rounded-2xl bg-indigo-500'></div>

                    <div className='w-32 h-32 rounded-full bg-green-500'></div> */}
                    <Image src="https://i.ibb.co/PZ3bdm7H/circulardp.png" alt="Abhishek" className='rounded-full' width={400} height={400} />
                </div>

                {/* <div className='glow absolute top-[40%] right-1/2 -z-10'>

                </div> */}
            </div>

            
            <div className='absolute bottom-5 sm:bottom-14 left-0 sm:-left-10'>

            <MovingButton borderRadius='0.5rem' className='p-3 font-semibold font-sans text-lg z-20'>
                <p>Developer 🧑‍💻</p>
                <div/>
                </MovingButton>
                </div>
        </div>
        </div>


    
  )
}

export default HeroSection;