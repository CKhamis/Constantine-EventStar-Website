import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {useForm} from "react-hook-form";
import * as z from "zod";
import {createEventSchema} from "@/components/ValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {TimestampPicker} from "@/components/ui/timestamp-picker";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {CalendarIcon, Loader2} from "lucide-react";
import { useState} from "react";
import { InviteRigidity, EventType, ReminderAmount } from "@prisma/client";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import GuestSelectionDialog from "@/components/GuestSelectionDialog";
import axios from "axios";

export default function NewEventForm() {
    const form = useForm<z.infer<typeof createEventSchema>>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            title: '',
            address: '',
            eventStart: new Date(),
            eventEnd: new Date(),
            rsvpDuedate: new Date(),
            description: '',
            inviteRigidity: 'INVITE_ONLY',
            eventType: 'GENERAL_EVENT',
            reminderAmount: 'NONE',
            RSVP: [],
            authorId: 'fbe4fc73-91b9-4207-a2c3-3778086e17e1' // todo: this is a placeholder
        },
    });

    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Enum formatting
    const eventTypeOptions = Object.values(EventType).map((value) => ({
        label: value.replace(/_/g, " "),
        value,
    }));
    const inviteRigidityOptions = Object.values(InviteRigidity).map((value) => ({
        label: value.replace(/_/g, " "), // Replace underscores with spaces for readability
        value,
    }));
    const reminderAmountOptions = Object.values(ReminderAmount).map((value) => ({
        label: value.replace(/_/g, " "), // Replace underscores with spaces for readability
        value,
    }));

    async function onSubmit (values: z.infer<typeof createEventSchema>) {
        try{
            setIsLoading(true);
            await axios.post('/api/esmt/events/new', values);
            // router.push("/ESMT/guests?message=1");
        }catch(e){
            setIsLoading(false);
            setError("OOPS! Something happened :(");
            console.log(e)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-4">
                <GuestSelectionDialog onGuestsSelected={(data) => form.setValue("RSVP", data)}/>

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
                                            disabled={(date) =>
                                                date < new Date()
                                            }
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
                                            disabled={(date) =>
                                                date < new Date()
                                            }
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                            disabled={(date) =>
                                                date < new Date()
                                            }
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
                    Create Event
                </Button>
            </form>
        </Form>
    )
}