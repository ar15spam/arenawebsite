"use client"

import React from 'react'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { signInDb } from './actions'

const signinSchema = z.object({ 
    email: z.string().email("Invalid email!"),
    password: z.string().min(8, "Please make sure you entered the right password!"), 
    isCounselor: z.boolean().default(false), 
})

export type signinSchemaType = z.infer<typeof signinSchema>;

export default function SignInForm() {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<signinSchemaType>({
        resolver: zodResolver(signinSchema),
    });

    const onSubmit = async (data: signinSchemaType) => {
        console.log('Submitted data:', data);
        const response = await signInDb(data);
        console.log(response);
        if(response.success === true){
            if(response.counselorid){
                router.push(`/home/counselor/${response.counselorid}`);
            } else {
                router.push(`/portal/${response.userId}`);
            }
        } else {
            // Consider using a toast notification here instead of returning JSX
            console.error("Authentication failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isCounselor"
                                {...register('isCounselor')}
                            />
                            <Label htmlFor="isCounselor">I am a counselor</Label>
                        </div>
                        {errors.isCounselor && (
                            <p className="text-sm text-red-500">{errors.isCounselor.message}</p>
                        )}

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

                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}