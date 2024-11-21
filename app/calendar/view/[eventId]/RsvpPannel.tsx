'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const FormSchema = z.object({
    eventId: z.string(),
    guestId: z.string(),
    rsvp: z.enum(['YES', 'NO', 'MAYBE']).optional(),
})

export default function RsvpPannel({ eventId = '', guestId = '' }: { eventId: string; guestId: string }) {
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
        // setSubmitStatus('loading')
        // //const result = await axios.post(data)
        // if (result.success) {
        //     setSubmitStatus('success')
        // } else {
        //     setSubmitStatus('error')
        //     if (result.errors) {
        //         Object.keys(result.errors).forEach((key) => {
        //             form.setError(key as keyof FormData, {
        //                 type: 'server',
        //                 message: result.errors[key]?.[0],
        //             })
        //         })
        //     }
        // }
    }

    return (
        <Card>
            <CardHeader>
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

                        <Button type="submit" disabled={submitStatus === 'loading'}>
                            {submitStatus === 'loading' ? 'Submitting...' : 'Submit RSVP'}
                        </Button>

                        {submitStatus === 'success' && (
                            <p className="text-green-600">RSVP submitted successfully!</p>
                        )}
                        {submitStatus === 'error' && (
                            <p className="text-red-600">An error occurred. Please try again.</p>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}