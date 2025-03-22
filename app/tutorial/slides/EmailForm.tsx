'use client'

import z from 'zod'
import {basicUserInfo} from "@/components/Types";
import AvatarIcon from "@/components/AvatarIcon";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {editBasicUserInfoSchema} from "@/components/ValidationSchemas";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";

export type Props = {
    enableNextAction: () => void;
}

export default function EmailForm({enableNextAction}: Props){
    const form = useForm<z.infer<typeof editBasicUserInfoSchema>>({
        resolver: zodResolver(editBasicUserInfoSchema),
        defaultValues: {
            phoneNumber: "",
            name: "",
            discordId: "",
        },
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [name, setName] = useState<string>("New User");


    async function loadUserData() {
        try{
            setLoading(true);
            await axios.get('/api/user/setup/info')
                .then((response) => {
                    const userInfo = response.data;
                    form.setValue("name", userInfo.name || "");
                    form.setValue("discordId", userInfo.discordId || "");
                    form.setValue("phoneNumber", userInfo.phoneNumber || "");
                    setName(userInfo.name);
                    setImageUrl(userInfo.image);
                });
        }catch(e){
            console.log(e)
        }finally {
            setLoading(false);
        }
    }

    async function onSubmit(values: z.infer<typeof editBasicUserInfoSchema>) {
        try{
            setLoading(true);
            await axios.post('/api/user/setup/edit', values);
            enableNextAction();
        }catch(e){
            console.log(e)
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUserData();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center">
            <p className="text-3xl font-bold">Account Setup</p>
            <p className="text-center">Make sure your information is accurate and up to date.</p>

            <Card className="mt-10">
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row items-center justify-center">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center gap-5">
                            <AvatarIcon name={name} image={imageUrl} size={"large"}/>
                            <div>
                                <p className="font-bold text-2xl">{name}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Costi Khamis" {...field} />
                                        </FormControl>
                                        <FormMessage />
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
                                name="discordId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discord ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="costiboasty" {...field} />
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