"use server";

import { db } from "@/db";

type SignUpProfile = {
    profile: {
        name: string;
        email: string;
        selectedPrograms: { value: string; label: string }[];
        selectedInternshipOptions: { value: string; label: string; price: number }[];
        selectedResumeOptions: { value: string; label: string; price: number }[];
        selectedSATPrep: { value: string; label: string; price: number };
        satOneHourCount: number;
        additionalInfo: string;
    }
}
export async function getProfilesInfo(): Promise<SignUpProfile[]> {

    let response = await db.query.initialprofile.findMany({
        columns: {
            data: true,
        },
    });

    let profiles: SignUpProfile[] = []; 

    response.map((record) => {
        profiles.push(record.data as SignUpProfile)
    })

    return profiles;
}