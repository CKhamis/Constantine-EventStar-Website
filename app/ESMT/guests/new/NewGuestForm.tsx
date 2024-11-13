'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {createGuestSchema} from "@/components/ValidationSchemas";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {useState} from "react";
import { Loader2 } from "lucide-react"
import AlertMessage from "@/components/AlertMessage";


export default function NewGuestForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof createGuestSchema>>({
        resolver: zodResolver(createGuestSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            discordId: '',
        },
    })
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function onSubmit(values: z.infer<typeof createGuestSchema>) {
        try{
            setIsLoading(true);
            await axios.post('/api/esmt/guests/new', values);
            router.push("/ESMT/guests?message=1");
        }catch(e){
            setIsLoading(false);
            setError("OOPS! Something happened :(");
            console.log(e)
        }
    }

    return (
        <Form {...form}>
            <AlertMessage title="Form Error" message={error} code={2} />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormDescription>This field is required.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} />
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
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="animate-spin"/>}
                    Add Guest
                </Button>
            </form>
        </Form>
    )
}