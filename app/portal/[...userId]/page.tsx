"use client"

import React, { useState, useEffect, ReactNode } from 'react'
import { IoMdNotificationsOutline } from "react-icons/io"
import { IconContext } from "react-icons"
import { getInfo } from './actions'

import Home from "@/components/portal/Home"
import Calendar from '@/components/portal/Calendar'
import Drive from '@/components/portal/Drive'
import Classes from '@/components/portal/Classes'

interface BottomComponent {
  name: string
  link?: string
  reactComponent?: ReactNode
}

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

export default function NavigationLayout() {
  const [username, setUsername] = useState<string>("")
  const [displayNotifications, setDisplayNotifications] = useState<boolean>(false)
  const [bottom, setBottom] = useState<BottomComponent>({
    name: "Home",
    reactComponent: <Home />
  })

  const bottomComponents: BottomComponent[] = [
    { name: "Home", reactComponent: <Home /> },
    { name: "Drive", reactComponent: <Drive /> },
    { name: "Calendar", reactComponent: <Calendar /> },
    { name: "Classes", reactComponent: <Classes /> } 
  ]

  useEffect(() => {
    async function getUserName() {
      const response = await getInfo();
      if (isFrontendUser(response)) {
        setUsername(response.username ?? "No User Detected");
      } else if (isFrontendCounselor(response)) {
        setUsername(response.counselorname ?? "No Counselor Detected");
      }
    }
    getUserName();
  }, []);

  const toggleBottom = (component: BottomComponent) => {
    setBottom(component)
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      {/* Secondary Nav */}
      <div className="w-screen h-28 flex flex-col flex-wrap items-center border-b border-gray-200 shadow-sm">
        {/* Top portion with username and notifications */}
        <div className="w-screen h-1/2 flex flex-row flex-wrap items-center justify-between px-4 bg-white">
          <div className="font-semibold text-lg text-gray-800">
            {username}
          </div>
          <button 
            className="font-semibold text-md text-gray-600 w-8 h-8 rounded-full flex items-center justify-center hover:cursor-pointer border-2 border-black hover:border-gray-400 hover:bg-gray-50 transition-all shadow-sm"
            onClick={() => setDisplayNotifications(!displayNotifications)}
          >
            <IconContext.Provider value={{ size: "22" }}>
              <IoMdNotificationsOutline/>
            </IconContext.Provider>
          </button>
        </div>

        {/* Notifications popup */}
        {displayNotifications && (
          <div className="w-1/4 h-1/3 min-h-[200px] bg-white rounded-lg absolute top-16 right-8 z-20 shadow-lg border border-gray-200">
            <div className="w-full h-12 rounded-t-lg border-b border-gray-200 font-semibold text-md text-gray-800 flex items-center px-4 bg-gray-50">
              Notifications
            </div>
            <div className="p-4 text-sm text-gray-600">
              No new notifications
            </div>
          </div>
        )}

        {/* Third navbar with navigation items */}
        <div className="w-screen h-12 flex flex-row flex-wrap items-center px-3 gap-x-3">
          {bottomComponents.map((item) => (
            <div 
              key={item.name}
              onClick={() => toggleBottom(item)}
              className={`px-2 py-0.5 m-1 rounded-md cursor-pointer transition-all
                ${bottom.name === item.name 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>

      {/* Content area */}
      {bottom && bottom.reactComponent && (
        <div className="flex-1 bg-gray-50">
          {bottom.reactComponent}
        </div>
      )}
      {bottom && bottom.link && (
        <div className="flex-1 p-4 text-gray-700">
          Redirecting you to {bottom.link}
        </div>
      )}
    </div>
  )
}