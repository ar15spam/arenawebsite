"use server";

import { db } from "@/db";
import { counselors, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import type { signinSchemaType } from "./page";

export async function signInDb(data: signinSchemaType) {
    try {
        const { isCounselor, email, password } = data;

        if (isCounselor) {
            const counselor = await db.query.counselors.findFirst({
                where: eq(counselors.email, email),
            });

            if (!counselor) {
                return { success: false, error: "Invalid email or password" };
            }

            /* const passwordMatch = await bcrypt.compare(password, counselor.hashedPassword);
            if (!passwordMatch) {
                return { success: false, error: "Invalid email or password" };
            } */

            const cookieStore = await cookies();

            let counselorid = counselor.id; 
            console.log("counselorid:", counselorid);

            cookieStore.set({
                name: 'counselorid',
                value: counselorid,
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            });

            cookieStore.set({
                name: 'counselorfullname',
                value: counselor.fullname,
                httpOnly: false,
                secure: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            });

            cookieStore.set({
                name: 'counseloremail',
                value: counselor.email,
                httpOnly: false,
                secure: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            });

            return { success: true, counselorid: counselor.id };
        }

        // If not a counselor, treat as a regular user (client)
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            return { success: false, error: "Invalid email or password" };
        }

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatch) {
            return { success: false, error: "Invalid email or password" };
        }

        const cookieStore = await cookies();

        cookieStore.set({
            name: 'userid',
            value: user.id,
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        cookieStore.set({
            name: 'userfullname',
            value: user.fullname,
            httpOnly: false,
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        cookieStore.set({
            name: 'useremail',
            value: user.email,
            httpOnly: false,
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return { success: true, userId: user.id };

    } catch (error) {
        console.error("Sign-in error:", error);
        return { success: false, error: "An error occurred during sign-in" };
    }
}