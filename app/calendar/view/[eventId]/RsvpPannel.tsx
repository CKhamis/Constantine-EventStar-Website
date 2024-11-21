'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { Check, X } from 'lucide-react'
import {rsvpFormSchema} from "@/components/ValidationSchemas";

export default function RsvpPanel({ eventId, guestId }: { eventId: string; guestId: string }) {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const form = useForm<z.infer<typeof rsvpFormSchema>>({
        resolver: zodResolver(rsvpFormSchema),
        defaultValues: {
            eventId,
            guestId,
            response: undefined,
        },
    })

    useEffect(() => {
        const fetchCurrentRsvp = async () => {
            try {
                const response = await axios.post(`/api/events/rsvp/view/${eventId}`, { id: guestId });
                const currentRsvp = response.data.response;
                if (currentRsvp && currentRsvp !== 'NO_RESPONSE') {
                    form.setValue('response', currentRsvp);
                }
            } catch (error) {
                console.error('Error fetching current RSVP status:', error);
                setSubmitStatus('error')
            }
        }

        fetchCurrentRsvp()
    }, [])

    async function onSubmit(data: z.infer<typeof rsvpFormSchema>) {
        setSubmitStatus('loading')
        try {
            await axios.post(`/api/events/rsvp/edit/${data.eventId}`, {response: data.response, eventId: eventId, guestId: guestId})
            setSubmitStatus('success')
        } catch (e) {
            setSubmitStatus('error')
        } finally {
            setTimeout(() => setSubmitStatus('idle'), 3000)
        }
    }

    return (
        <Card>
            <CardHeader className="mb-2 pb-0">
                <CardTitle className="text-2xl font-bold">RSVP Status</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="response"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                                <Check className="h-4 w-4 text-green-500" />
                            )}
                            {submitStatus === 'error' && (
                                <X className="h-4 w-4 text-red-500" />
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

