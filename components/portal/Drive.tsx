"use client"

import React, { useState, useEffect } from 'react'
import { getMeetingData } from '@/app/portal/[...userId]/actions'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Props = {}

const Drive = (props: Props) => {

  interface MeetingData {
    data: {
      notes: {
          name: string;
          text: string;
      }[];
    }
  }

  const isMeetingData = (data: any): data is NonNullable<MeetingData> => {
    return (
      data && 
      typeof data.data === "object" &&
      Array.isArray(data.data.notes) &&
      data.data.notes.every(
        (item: any) => 
          typeof item.name === "string" &&
          typeof item.text === "string"
      )
    ); 
  }

  const [meetingdata, setMeetingdata] = useState<MeetingData>({ data: { notes: [] }});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getMD() {
      try {
        const response = await getMeetingData();
        if (response && isMeetingData(response.meetingData)) {
          setMeetingdata(response.meetingData);
        }
      } catch (error) {
        console.error("Error fetching meeting data:", error);
      } finally {
        setLoading(false);
      }
    }
    getMD();
  }, []);

  console.log(meetingdata); 
    
  return (
    <div className="p-4 space-y-4">
      {loading ? (
        <p>Loading... </p>
      ) : meetingdata.data.notes.length === 0 ? (
        <p className="text-gray-500 italic">No meeting data available...</p>
        ) : meetingdata && meetingdata.data.notes.length > 0 ? (
          meetingdata.data.notes.map((note, index) => (
            <Card key={index} className="shadow-lg rounded-2xl p-4">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{note.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">{note.text}</CardContent>
            </Card>
          ))
        ) : (
        <p className="text-center text-gray-500">No meeting notes available.</p>
      )}
  </div>
  )
}

export default Drive