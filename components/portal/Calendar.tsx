"use client"

import React from 'react'
import UserCalender from '../other/UserCalender'

type Props = {}

const Calendar = (props: Props) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <UserCalender />
    </div>
  )
}

export default Calendar;