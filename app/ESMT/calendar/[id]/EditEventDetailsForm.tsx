"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { TimestampPicker } from "@/components/ui/timestamp-picker"
import UserSelection from "./UserSelection"
import AlertList, { alertContent } from "@/components/AlertList"
import { cn } from '@/lib/utils'

import { editEventSchema } from "@/components/ValidationSchemas"
import { InviteRigidity, EventType, ReminderAmount } from "@prisma/client"
import {RsvpWithUser} from "@/components/Types";
import {GradientPicker} from "@/components/ui/GradientPicker";

interface EditEventFormProps {
    eventId: string
}

export default function EditEventForm({ eventId }: EditEventFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [alertMessages, setAlertMessages] = useState<alertContent[]>([])
    const [rsvpGuests, setRsvpGuests] = useState<RsvpWithUser[]>([])

    const form = useForm<z.infer<typeof editEventSchema>>({
        resolver: zodResolver(editEventSchema),
        defaultValues: {
            id: eventId,
            title: '',
            address: '',
            backgroundStyle: '#333',
            eventStart: new Date(),
            eventEnd: new Date(),
            rsvpDuedate: new Date(),
            description: '',
            inviteRigidity: 'INVITE_ONLY',
            eventType: 'GENERAL_EVENT',
            reminderAmount: 'NONE',
            RSVP: [],
            authorId: ''
        },
    })

    useEffect(() => {


        fetchEventData()
    }, [eventId, form, alertMessages])

    async function fetchEventInfo() {
        try {
            const response = await axios.get(`/api/events/view/${eventId}`)
            return response.data
        } catch (err) {
            console.error("Error fetching event:", err)
            return null
        }
    }

    async function fetchRsvpUsers() {
        try {
            const response = await axios.get(`/api/events/rsvp/users/${eventId}`)
            return response.data
        } catch (err) {
            console.error("Error fetching RSVP users:", err)
            return null
        }
    }

    async function onSubmit(values: z.infer<typeof editEventSchema>) {
        try {
            setIsLoading(true)
            await axios.post(`/api/esmt/events/edit`, values)
            fetchEventData().then(() => setIsLoading(false))
        } catch (e) {
            setIsLoading(false)
            console.log(e)
            setAlertMessages([...alertMessages, { title: "Error", message: "Unable to update event", icon: 2 }])
        }
    }

    async function fetchEventData() {
        try {
            const [eventInfo, rsvpGuests] = await Promise.all([
                fetchEventInfo(),
                fetchRsvpUsers()
            ]);

            if (eventInfo) {
                setRsvpGuests(rsvpGuests || [])
                form.reset({
                    ...eventInfo,
                    id: eventId,
                    eventStart: new Date(eventInfo.eventStart),
                    eventEnd: new Date(eventInfo.eventEnd),
                    rsvpDuedate: new Date(eventInfo.rsvpDuedate),
                    backgroundStyle: eventInfo.backgroundStyle,
                    RSVP: rsvpGuests.map((rsvp:RsvpWithUser) => rsvp.User.id) || []
                })

            } else {
                setAlertMessages([...alertMessages, { title: "Error", message: "Event not found", icon: 2 }])
            }
        } catch (error) {
            console.error("Error fetching event data:", error)
            setAlertMessages([...alertMessages, { title: "Error", message: "Failed to load event data", icon: 2 }])
        }
    }

    // Enum formatting
    const eventTypeOptions = Object.values(EventType).map((value) => ({
        label: value.replace(/_/g, " "),
        value,
    }))
    const inviteRigidityOptions = Object.values(InviteRigidity).map((value) => ({
        label: value.replace(/_/g, " "),
        value,
    }))
    const reminderAmountOptions = Object.values(ReminderAmount).map((value) => ({
        label: value.replace(/_/g, " "),
        value,
    }))

    return (
        <Form {...form}>
            <AlertList alerts={alertMessages} />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-4">
                <UserSelection initialSelectedGuests={rsvpGuests.map(rsvp => rsvp.User.id)} onGuestsSelected={(data) => form.setValue("RSVP", data)}/>
                <FormField
                    control={form.control}
                    name="id"
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
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Event title" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="123 Terence Street" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="backgroundStyle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Background Style</FormLabel>
                            <br />
                            <FormControl>
                                <GradientPicker {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex flex-col md:flex-row justify-between">
                    <FormField
                        control={form.control}
                        name='eventStart'
                        render={({ field }) => (
                            <FormItem className='flex flex-col items-start'>
                                <FormLabel>Event Start</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            className={cn(
                                                'justify-start text-left font-normal',
                                                !field.value && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                            {field.value ? (
                                                format(field.value, 'PPP hh:mm a')
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0'>
                                        <Calendar
                                            mode='single'
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                        <div className='p-3 border-t border-border'>
                                            <TimestampPicker setDate={field.onChange} date={field.value} />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='eventEnd'
                        render={({ field }) => (
                            <FormItem className='flex flex-col items-start'>
                                <FormLabel className="mt-5 md:mt-0">Event End</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            className={cn(
                                                'justify-start text-left font-normal',
                                                !field.value && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                            {field.value ? (
                                                format(field.value, 'PPP hh:mm a')
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0'>
                                        <Calendar
                                            mode='single'
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                        <div className='p-3 border-t border-border'>
                                            <TimestampPicker setDate={field.onChange} date={field.value} />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Event description"
                                    {...field}
                                    className="textarea-class"
                                    rows={4}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="inviteRigidity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Invite Rigidity</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select invite rigidity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {inviteRigidityOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Type</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select event type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {eventTypeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex flex-col md:flex-row justify-between gap-3">
                    <FormField
                        control={form.control}
                        name="reminderAmount"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Reminder Amount</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select reminder amount" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {reminderAmountOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='rsvpDuedate'
                        render={({ field }) => (
                            <FormItem className='flex flex-col items-start mt-2'>
                                <FormLabel>RSVP Due Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            className={cn(
                                                'justify-start text-left font-normal w-full',
                                                !field.value && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                            {field.value ? (
                                                format(field.value, 'PPP hh:mm a')
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0'>
                                        <Calendar
                                            mode='single'
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                        <div className='p-3 border-t border-border'>
                                            <TimestampPicker setDate={field.onChange} date={field.value} />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="animate-spin"/>}
                    Update Event
                </Button>
            </form>
        </Form>
    )
}
