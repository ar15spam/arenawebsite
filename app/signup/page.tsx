"use client";

import React from 'react';
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupuser } from './actions';

const userSchema = z.object({
    fullname: z.string().min(2, "Please enter your real name!"),
    grade: z.number().min(9, "Grade must be at least 9").max(12, "Grade must be at most 12"),
    email: z.string().email("Invalid email!"),
    password: z.string().min(8, "Password must be at least 8 characters long!"),
    phonenumber: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number!"),
});

export type userSchemaType = z.infer<typeof userSchema>;

export default function SignUpForm() {
    const router = useRouter();
    
    const { register, handleSubmit, formState: { errors } } = useForm<userSchemaType>({
        resolver: zodResolver(userSchema),
    });

    const onSubmit = async (data: userSchemaType) => {
        try {
            const sendToDb = await signupuser(data);
            
            if (sendToDb?.success) {
                console.log("Data sent to db!");
                router.push(`/portal/${sendToDb.userId}`);
            } else {
                console.error("Signup failed:", sendToDb?.error);
                alert("Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred during signup. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input
                                id="fullname"
                                type="text"
                                placeholder="John Doe"
                                {...register('fullname')}
                                className="w-full"
                            />
                            {errors.fullname && (
                                <p className="text-sm text-red-500">{errors.fullname.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="grade">Grade</Label>
                            <Input
                                id="grade"
                                type="number"
                                placeholder="12"
                                {...register('grade', { valueAsNumber: true })}
                                className="w-full"
                            />
                            {errors.grade && (
                                <p className="text-sm text-red-500">{errors.grade.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                {...register('email')}
                                className="w-full"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                className="w-full"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phonenumber">Phone Number</Label>
                            <Input
                                id="phonenumber"
                                type="tel"
                                placeholder="(123) 456-7890"
                                {...register('phonenumber')}
                                className="w-full"
                            />
                            {errors.phonenumber && (
                                <p className="text-sm text-red-500">{errors.phonenumber.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}