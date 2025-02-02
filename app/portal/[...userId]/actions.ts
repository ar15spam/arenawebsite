"use server";

import { db } from "@/db";
import { users, counselors, counselorSchedules, userSchedule, meetings, classes, usersOnClasses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

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

export async function getInfo(): Promise<Subject | null> {
    const cookieStore = await cookies();
    const counselorId = cookieStore.get("counselorid")?.value;
    const userId = cookieStore.get("userid")?.value;

    if (counselorId) {
        const counselor = await db.query.counselors.findFirst({
            where: eq(counselors.id, counselorId),
        });

        if (counselor) {
            return { 
                isCounselor: true, 
                counselorname: counselor.fullname, 
                counselorId 
            };
        }
    } else if (userId) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (user) {
            return { 
                isCounselor: false, 
                username: user.fullname, 
                userId 
            };
        }
    }

    return null;
}

function isCounselor(subject: Subject): subject is Extract<Subject, { isCounselor: true }> {
    return subject.isCounselor;
}

function isUser(subject: Subject): subject is Extract<Subject, { isCounselor: false }> {
    return !subject.isCounselor;
}

export async function getCalendarInfo() {
    const subject = await getInfo();
  
    if (!subject) {
        return { calenderdata: null };
    }

    if (isCounselor(subject)) {
        const calendarInfo = await db.query.counselorSchedules.findFirst({
            where: eq(counselorSchedules.counselorId, subject.counselorId),
        });

        return { calenderdata: calendarInfo?.data ?? null };
    } 
    
    if (isUser(subject)) {
        const calendarInfo = await db.query.userSchedule.findFirst({
            where: eq(userSchedule.userId, subject.userId),
        });

        return { calenderdata: calendarInfo?.data ?? null };
    }

    return { calenderdata: null };
}

export async function getMeetingData() {
    const subject = await getInfo(); 

    if (!subject) return { meetingData: null };

    if(isCounselor(subject)){
        const meetingdata = await db.query.meetings.findMany({
            where: eq(meetings.counselorId, subject.counselorId)
        })

        let data = []; 

        data = meetingdata.map(({ data }) => ({ data })); 

        return { meetingData: data ?? null }; 
    }

    if (isUser(subject)) {
        const meetingdata = await db.query.meetings.findMany({
            where: eq(meetings.userId, subject.userId)
        });

        const data = meetingdata.map(({ data }) => ({ data }));
    
        return { meetingData: data.length > 0 ? data[0] : null }; 
    }
    

    return { meetingData: null };
}

export async function getClasses() {
    const subject = await getInfo();
  
    if (!subject) return { classes: null };
  
    if (isCounselor(subject)) {
      const returnclasses = await db.query.classes.findMany({
        where: eq(classes.counselorId, subject.counselorId),
      });
      return { classesData: returnclasses };
    }
  
    if (isUser(subject)) {
      const userClasses = await db.query.usersOnClasses.findMany({
        where: eq(usersOnClasses.userId, subject.userId),
      });
  
      const returnclasses = await Promise.all(
        userClasses.map(async ({ classId }) => {
          const classesForUser = await db.query.classes.findMany({
            where: eq(classes.id, classId),
          });
          return classesForUser;
        })
      );
  
      const flattenedClasses = returnclasses.flat(); 
      return { classesData: flattenedClasses };
    }
  }

export async function getClassesData() {
    const subject = await getInfo(); 

    if(!subject) return  null ; 

    if (isCounselor(subject)) {
        const classesData = await db.query.classes.findMany({
            where: eq(classes.counselorId, subject.counselorId),
        });

        const mappedData = Object.fromEntries(
            classesData.map(({ id, data }) => [id, data])
        );
    
        return mappedData ?? null;
    }

    if (isUser(subject)) {
        const userClasses = await db.query.usersOnClasses.findMany({
            where: eq(usersOnClasses.userId, subject.userId),
        });
    
        const data = await Promise.all(
            userClasses.map(async ({ classId }) => {
                return await db.query.classes.findFirst({
                    where: eq(classes.id, classId),
                });
            })
        );
    
        return  data.filter(Boolean) ?? null ; // remove them null values ya hurr 
    }


    return { classesData: null }; 
}