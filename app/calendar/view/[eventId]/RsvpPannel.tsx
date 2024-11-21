'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import axios from "axios";
import {Check, X} from "lucide-react";

const FormSchema = z.object({
    eventId: z.string(),
    guestId: z.string(),
    rsvp: z.enum(['YES', 'NO', 'MAYBE']).optional(),
})

export default function RsvpPannel({ eventId , guestId }: { eventId: string; guestId: string }) {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            eventId,
            guestId,
            rsvp: undefined,
        },
    })

    async function onSubmit(data: FormData) {
        setSubmitStatus('loading')
        try{
            const result = await axios.post("/api/events/rsvp/" + data.eventId, {guestId: data.guestId, response: data.rsvp})
            setSubmitStatus('success')
        }catch (e){
            setSubmitStatus('error')
            if (result.errors) {
                Object.keys(result.errors).forEach((key) => {
                    form.setError(key as keyof FormData, {
                        type: 'server',
                        message: result.errors[key]?.[0],
                    })
                })
            }
        }
        //console.log(data);
    }

    return (
        <Card>
            <CardHeader className="mb-0 pb-0">
                <CardTitle className="text-2xl font-bold">RSVP Status</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <input type="hidden" {...form.register('eventId')} />
                        <input type="hidden" {...form.register('guestId')} />

                        <FormField
                            control={form.control}
                            name="rsvp"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your RSVP status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="YES">Yes</SelectItem>
                                            <SelectItem value="NO">No</SelectItem>
                                            <SelectItem value="MAYBE">Maybe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-row gap-4 items-center justify-start">
                            <Button type="submit" disabled={submitStatus === 'loading'}>
                                {submitStatus === 'loading' ? 'Submitting...' : 'Save'}
                            </Button>

                            {submitStatus === 'success' && (
                                <Check className="h-4 w-4" />
                            )}
                            {submitStatus === 'error' && (
                                <X className="h-4 w-4" />
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}