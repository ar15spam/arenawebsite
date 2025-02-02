"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { getInfo } from "@/app/portal/[...userId]/actions";

import Image from "next/image";
import Link from "next/link";

type Subject =
  | {
      isCounselor: true;
      counselorname: string;
      counselorId: string;
    }
  | {
      isCounselor: false;
      username: string;
      userId: string;
};


function isFrontendUser(subject: any): subject is Extract<Subject, { isCounselor: false }> {
  return subject && typeof subject === "object" && "isCounselor" in subject && !subject.isCounselor;
}

function isFrontendCounselor(subject: any): subject is Extract<Subject, { isCounselor: true }> {
  return subject && typeof subject === "object" && "isCounselor" in subject && subject.isCounselor;
}

const HeroSection = () => {

  const[userid, setuserid] = useState<String>(""); 

  useEffect(() => {
    async function getUserId() {
      const response = await getInfo();
      if(isFrontendUser(response)){
        setuserid(response.userId ?? "no user detected"); 
      }
    }
    getUserId(); 
  }, []); 

  return (
    <section className="hero-section bg-white text-black min-h-screen flex flex-col items-center justify-center">
      <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <div className="logo flex items-center text-lg font-bold">
          <Image src="/logo123.png" alt="" width={50} height={50} />
          <span>ARENA</span>
        </div>
        <nav className="hidden lg:flex text-sm space-x-8">
          <button className="hover:underline">
            <Link href={`/portal/${userid}`}>Portal</Link>
            </button>
          <button className="hover:underline">Testimonials</button>
          <button className="hover:underline">FAQs</button>
          <button className="hover:underline">Essays</button>
        </nav>
        <div className="relative inline-flex group">
          <div
            className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-full blur-md group-hover:opacity-100 group-hover:-inset-0.5 group-hover:duration-200 animate-tilt"
          ></div>
          <button
            className="relative inline-flex items-center justify-center px-6 py-3 text-md font-semibold text-black transition-all duration-200 bg-white font-pj rounded-full"
          >
            <Link href="/arenasignup">
            Register
            </Link>
          </button>
        </div>
      </header>

      <div className="flex flex-col items-center text-center px-4">
        <div className="neon-logo">
          <Image src="/logo123.webp" alt="" width={300} height={300} />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-snug">
          Your Path to College Starts Here!
        </h1>
        <p className="text-gray-400 mt-4 max-w-2xl">
          Get help finding and applying to internships from students who have
          done it.
        </p>
        <div className="relative inline-flex group mt-10">
          <div
            className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-full blur-md group-hover:opacity-100 group-hover:-inset-0.5 group-hover:duration-200 animate-tilt"
          ></div>
          <button
            className="relative inline-flex items-center justify-center px-6 py-3 text-md font-semibold text-black transition-all duration-200 bg-white font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Learn More →
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;