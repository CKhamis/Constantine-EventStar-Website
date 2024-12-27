'use client'

import z from 'zod'
import {enrollerResponse} from "@/components/Types";
import AvatarIcon from "@/components/AvatarIcon";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {enrollmentSchema} from "@/components/ValidationSchemas";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";

export type Props = {
    enrollerResponse: enrollerResponse;
    enableNextAction: () => void;
}

export default function EmailForm({enrollerResponse, enableNextAction}: Props){
    const form = useForm<z.infer<typeof enrollmentSchema>>({
        resolver: zodResolver(enrollmentSchema),
        defaultValues: {
            enrollerId: enrollerResponse.id,
            phoneNumber: enrollerResponse.user.phoneNumber ?? undefined,
            email: enrollerResponse.user.email ?? undefined,
            discordId: enrollerResponse.user.discordId ?? undefined,
        },
    });

    const [loading, setLoading] = useState<boolean>(false);

    async function onSubmit(values: z.infer<typeof enrollmentSchema>) {
        try{
            setLoading(true);
            await axios.post('/api/users/enrollment/editUser', values);
            enableNextAction();
        }catch(e){
            console.log(e)
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <p className="text-3xl font-bold">Account Setup</p>
            <p className="text-center">Make sure your email matches what you will use to sign in with next!</p>

            <Card className="mt-10">
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center gap-5">
                            <AvatarIcon name={enrollerResponse.author.name} image={enrollerResponse.author.image} size={"large"}/>
                            <div>
                                <p className="font-bold text-2xl">{enrollerResponse.author.name}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="enrollerId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="hidden" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone number</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="5058425662" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discordId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discord ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="johndoe#1234" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={loading || !form.formState.isValid}>
                                {loading && <Loader2 className="animate-spin"/>}
                                Save
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

        </div>
    );
}