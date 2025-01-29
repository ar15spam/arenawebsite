"use server"

import { db } from "@/db"
import { initialprofile } from "@/db/schema"
import { v4 as uuid } from "uuid"

interface SignUpProfile {
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

export async function createProfile(data: SignUpProfile) {

    const { profile } = data; 

    const profileId = uuid(); 

    const response = await db.insert(initialprofile).values({
        id: profileId, 
        data: { 
            "name": profile.name, 
            "email": profile.email,
            "selectedPrograms": [
                ...profile.selectedPrograms, 
            ],
            "selectedInternshipOptions": profile.selectedInternshipOptions, 
            "selectedResumeOptions": profile.selectedResumeOptions, 
            "selectedSATPrep": profile.selectedSATPrep, 
            "satOneHourCount": profile.satOneHourCount,
            "additionalInfo": profile.additionalInfo, 
        },
    });

    if(response){
        console.log(response); 
        return { success: true }; 
    }

    return { success: false }; 
}