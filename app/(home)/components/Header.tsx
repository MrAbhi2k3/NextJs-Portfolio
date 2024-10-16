import React from 'react'

 const Header = () => {
   return (
     <div className='sm:flex flex-col relative top-0 shadow-md w-full h-6 sm:h-8 text-white'
     >
         <h1 className="font-mono w-full fixed top-0 left-0 right-0 text-center items-center justify-center bg-gradient-to-r from-green-500 to-indigo-400">You Can Hire Me! for the Frontend, MERN-Stack, Graphic Deisgns, Social Handler. To connect Check Us Below 🚀</h1>
     </div>
   )
 }

 export default Header;

//  Note:
//  For the Transition effect of the text, you can use the TextGenerateEffect component from the portfolio/components/ui/text-generate-effect.tsx file


// import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
// import React from 'react'

// const text = `You Can Hire Me! for the Frontend, MERN-Stack, Graphic Deisgns, Social Handler. To connect Check Us Below 🚀`;

//  const Header = () => {
//    return (
//      <div className='hidden sm:flex flex-col fixed top-0 shadow-md w-full items-center justify-center h-6 sm:h-8 bg-gradient-to-r from-green-500 to-indigo-400 text-white'
//      >
//          <TextGenerateEffect className="font-mono mb-2 w-full text-center items-center justify-center" words={text}/>
//      </div>
//    )
//  }

//  export default Header;
