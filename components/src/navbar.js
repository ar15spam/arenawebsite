"use client";

import React from 'react';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image';

const NAVBAR1 = () => {
  const router = useRouter();
  return (
    
     
      <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <div className="logo flex items-center text-lg font-bold">
          <Image src="/logo123.webp" alt="" width={10} height={10} />
          <span>ARENA</span>
        </div>
        
        <div className="relative inline-flex group">
          <div
            className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-full blur-md group-hover:opacity-100 group-hover:-inset-0.5 group-hover:duration-200 animate-tilt"
          ></div>
          <button
            onClick={() => router.push('/')}
            className="relative inline-flex items-center justify-center px-6 py-3 text-md font-semibold text-black transition-all duration-200 bg-white font-pj rounded-full"
          >
            Exit Form
          </button>
        </div>
      </header>
  );
};


export default NAVBAR1;