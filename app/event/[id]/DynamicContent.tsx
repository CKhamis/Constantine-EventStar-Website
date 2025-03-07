'use client'

import {useEffect, useState} from "react";
import {LoadingIcon} from "@/components/LoadingIcon";
import Image from "next/image";
import axios from "axios";
import {EIResponse} from "@/app/api/events/invited/route";
import {EVResponse} from "@/app/api/events/view/[id]/route";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Check, X} from "lucide-react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {rsvpSchema} from "@/components/ValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns";
import Link from "next/link";

export interface Props {
    eventId: string,
}

export default function DynamicContent({eventId}: Props) {
    const [loading, setLoading] = useState(true);
    const [RSVP, setRSVP] = useState<EIResponse | null>();
    const [eventInfo, setEventInfo] = useState<EVResponse | null>();
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function refresh(){
        setLoading(true);
        await axios.get("/api/events/view/" + eventId)
            .then((response) => {
                // Event exists, but can either be just event or rsvp + event

                // Data can either be event or rsvp + event
                if(response.data.event){
                    setEventInfo(response.data.event);
                    setRSVP(response.data);
                    document.querySelector("#background")!.style.background = response.data.event.backgroundStyle;
                }else{
                    setEventInfo(response.data);
                    setRSVP(null);
                    document.querySelector("#background")!.style.background = response.data.backgroundStyle;
                }
            })
            .catch((error) => {
                console.log(error.status); // event not found, access denied, or need login
            });
        setLoading(false);
    }

    async function onSubmit(data: z.infer<typeof rsvpSchema>) {

    }

    const form = useForm<z.infer<typeof rsvpSchema>>({
        resolver: zodResolver(rsvpSchema),
        defaultValues: {
            response: undefined,
        },
    })

    useEffect(() => {
        refresh()
    }, []);

    return (
        <>
            {loading && <LoadingIcon/>}
            <div className="w-100 lg:h-screen grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 lg:h-100 lg:overflow-y-scroll">
                    <div className="top-left-gradient">
                        <div className="container flex-col flex gap-3 py-3 max-w-5xl">
                            <div className="flex flex-row justify-start items-center gap-3 ">
                                <Image src="/icons/Events.svg" alt="Event icon" width={50} height={50}/>
                                <p className="text-3xl font-bold">Event Details</p>
                            </div>
                        </div>
                    </div>
                    <div id="background">
                        <div className="container flex-col flex gap-3 py-3 max-w-5xl">
                            {eventInfo ? (
                                <p>{eventInfo.title}</p>
                            ) : (
                                <p>Event not found</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="h-100 border-l-2">
                    <div className="border-b-2 w-100 p-5">
                        <div className="max-w-xl mx-auto">
                            <p className="text-2xl font-bold">RSVP Status</p>
                            {RSVP && eventInfo? (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                                        <FormField
                                            control={form.control}
                                            name="response"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} value={field.value} disabled={new Date(eventInfo.rsvpDuedate) < new Date()}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select your RSVP status"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="YES">Yes</SelectItem>
                                                            <SelectItem value="NO">No</SelectItem>
                                                            <SelectItem value="MAYBE">Maybe</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <p className="text-muted-foreground text-sm">{new Date(eventInfo.rsvpDuedate) < new Date() ? `too late to respond` : `Respond by ${format(new Date(eventInfo.rsvpDuedate), 'PPP')}`}</p>
                                        <div className="flex flex-row gap-4 items-center justify-start">
                                            <Button type="submit" disabled={submitStatus === 'loading' || new Date(eventInfo.rsvpDuedate) < new Date()}>
                                                {submitStatus === 'loading' ? 'Submitting...' : 'Save'}
                                            </Button>

                                            {submitStatus === 'success' && (
                                                <Check className="h-4 w-4 text-green-500"/>
                                            )}
                                            {submitStatus === 'error' && (
                                                <X className="h-4 w-4 text-red-500"/>
                                            )}
                                        </div>
                                    </form>
                                </Form>
                            ) : (
                                <div className="flex flex-col gap-5 mt-5">
                                    <p>Please log in with an invited EventStar account to RSVP to this event!</p>
                                    <Link href="/api/auth/signin">
                                        <Button size="sm">
                                            Log in
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}