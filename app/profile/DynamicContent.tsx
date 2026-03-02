'use client'

import AvatarIcon from "@/components/AvatarIcon";
import {Button} from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios";
import {useEffect, useState} from "react";
import {userInfoResponse} from "@/app/api/user/info/route";
import {EIResponse} from "@/app/api/events/invited/route";
import {LoadingIcon} from "@/components/LoadingIcon";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {Check, CheckCircle2, CircleHelp, X} from "lucide-react";
import {format} from "date-fns";
import Image from "next/image";
import Footer from "@/components/Footer";
import {FRResponse} from "@/app/api/user/connections/incoming/route";
import FollowDialog from "@/app/profile/FollowDialog";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useForm} from "react-hook-form";
import {notificationFrequencySchema} from "@/components/ValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {
    DiscordUsernameSearchResponse,
    DiscordUsernameSearchResult
} from "@/app/api/user/notifications/providers/discord/searchUser/route";
import z from "zod";

export interface Props{
    session: {user: {id: string, name: string, image: string, email: string}}
}

export default function DynamicContent({session}: Props) {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<userInfoResponse | null>(null);
    const [RSVPs, setRSVPs] = useState<EIResponse[]>([]);
    const [receivedFollows, setReceivedFollows] = useState<FRResponse[]>([]);
    const [notificationResponse, setNotificationResponse] = useState<number>(0);
    const [discordInfo, setDiscordInfo] = useState<DiscordUsernameSearchResult | null>(null);

    async function refresh(){
        setLoading(true);
        await axios.get("/api/user/info")
            .then((response) => {
                setUserInfo(response.data);
                return response.data;
            })
            .then((data) => {
                if(data.discordId){
                    axios.post("/api/user/notifications/providers/discord/getUsers", {list: [data.discordId]})
                        .then((response) => {
                            if(response.data.results.length > 0){
                                setDiscordInfo(response.data.results[0]);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            })
            .catch((error) => {
                console.log(error);
            });

        await axios.get("/api/events/authored")
            .then((response) => {
                setRSVPs(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        await axios.get("/api/user/connections/incoming")
            .then((response) => {
                setReceivedFollows(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        setLoading(false);
    }

    async function respondFR(response:boolean, senderId:string){
        await axios.post("/api/user/connections/respond", {response: response, senderId: senderId})
            .then(() => {
                refresh();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function removeFollower(senderId:string){
        await axios.post("/api/user/connections/delete/follower", {id: senderId})
            .then(() => {
                refresh()
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function removeFollowing(senderId:string){
        await axios.post("/api/user/connections/delete/following", {id: senderId})
            .then(() => {
                refresh()
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function updateRSVP(eventId: string, response: string){
        setLoading(true);
        try{
            await axios.post(`/api/events/rsvp/${eventId}`, {response: response})
                .finally(refresh);
        }catch (e){
            console.log(e)
        }
    }

    // Discord Connection
    const freqForm = useForm<z.infer<typeof notificationFrequencySchema>>({
        resolver: zodResolver(notificationFrequencySchema),
        defaultValues: { freq: 1 },
        mode: "onSubmit",
    });

    async function onSubmitFrequency(values: z.infer<typeof notificationFrequencySchema>) {
        try {
            setLoading(true);
            const response = await axios.post(
                "/api/user/notifications/providers/discord/setFrequency",
                values
            );
            toast("Frequency Updated", { description: "Discord notification frequency changed." })
            if(response.status === 200) {
                setNotificationResponse(1);
            }else{
                setNotificationResponse(2);
            }
        } catch (e) {
            console.log(e);
        } finally {
            await refresh();
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh()
    }, []);

    if(userInfo == null){
        return (
            <>
                {loading && <LoadingIcon/>}
            </>
        );
    }

    return (
        <>
            {loading && <LoadingIcon/>}
            <div className="w-100 container p-5 flex flex-col gap-5">
                <div className="flex justify-between items-center border-b-2 pb-5 overflow-x-hidden">
                    <div className="flex flex-row justify-start items-center gap-3">
                        <AvatarIcon size="large" image={session.user.image} name={session.user.name}/>
                        <div>
                            <p className="text-3xl font-bold">{session.user.name}</p>
                            <p>{session.user.email}</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex flex-row gap-5 items-center justify-end">
                        <div>
                            <p className="">Follower{userInfo.followedBy.length === 1 ? "" : "s"}</p>
                            <p className="text-xl">{userInfo.followedBy.length}</p>
                        </div>
                        <div>
                            <p className="">Event{userInfo.event.length === 1? "" : "s"}</p>
                            <p className="text-xl">{userInfo.event.length}</p>
                        </div>
                        <div>
                            <p className="">Following</p>
                            <p className="text-xl">{userInfo.following.length}</p>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="events" className="w-100">
                    <TabsList>
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="followers">Followers</TabsTrigger>
                        <TabsTrigger value="following">Following</TabsTrigger>
                        <TabsTrigger value="requests">Requests</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    </TabsList>
                    <TabsContent value="events" className="mt-5">
                        <div className="w-100 flex flex-row justify-between items-center mb-5">
                            <p className="text-3xl font-bold">Your Events</p>
                            <Link href="/editEvent"><Button>New Event</Button></Link>
                        </div>
                        <div className="max-w-2xl mx-auto">
                            {RSVPs.map((rsvp) => (
                                <Card key={rsvp.id} className="mb-4 rounded-none">
                                    <CardHeader>
                                        <div className="flex flex-row items-center justify-between space-y-0 gap-2">
                                            <CardTitle className="text-2xl">{rsvp.event.title}</CardTitle>
                                            <div>
                                                <ToggleGroup type="single" variant="default" defaultValue={rsvp.response} disabled={new Date(rsvp.event.rsvpDuedate) < new Date()}>
                                                    <ToggleGroupItem value="YES" aria-label="Toggle check" onClick={() => updateRSVP(rsvp.event.id, "YES")}>
                                                        <Check className="h-4 w-4"/>
                                                    </ToggleGroupItem>
                                                    <ToggleGroupItem value="MAYBE" aria-label="Toggle question" onClick={() => updateRSVP(rsvp.event.id, "MAYBE")}>
                                                        <CircleHelp className="h-4 w-4"/>
                                                    </ToggleGroupItem>
                                                    <ToggleGroupItem value="NO" aria-label="Toggle x" onClick={() => updateRSVP(rsvp.event.id, "NO")}>
                                                        <X className="h-4 w-4"/>
                                                    </ToggleGroupItem>
                                                </ToggleGroup>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{format(new Date(rsvp.event.eventStart), "M/dd/yyyy hh:mm a")} - {format(new Date(rsvp.event.eventEnd), "M/dd/yyyy hh:mm a")}</p>
                                    </CardHeader>
                                    <CardContent>
                                        {rsvp.event.description}
                                    </CardContent>
                                    <CardFooter className="gap-4 flex flex-row justify-between items-start">
                                        <div className="flex flex-col justify-start gap-2">
                                            <p>Event by:</p>
                                            <div className="flex flex-row items-center justify-start gap-2">
                                                <AvatarIcon image={rsvp.event.author.image} name={rsvp.event.author.name} size="xsmall"/>
                                                <p className="font-bold">{rsvp.event.author.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center gap-2">
                                            <Link href={"/event/" + rsvp.event.id}><Button variant={new Date(rsvp.event.eventEnd) < new Date() ? "secondary" : "default"}>View Event</Button></Link>
                                            {new Date(rsvp.event.eventEnd) < new Date() ?
                                                <p className="text-muted-foreground text-xs ml-1">Event ended</p> : <></>}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                            {RSVPs.length === 0 && (
                                <div className="w-100 h-100 flex justify-center flex-col items-center">
                                    <Image src="/agent/empty.png" height={200} width={200} alt="" className="mt-10"/>
                                    <p className="font-bold text-3xl mb-5">No Events Created</p>
                                    <p className="text-muted-foreground text-sm">Click on New Event to get started!</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="followers" className="mt-5">
                        <div className="w-100 flex flex-row justify-between items-center mb-5">
                            <p className="text-3xl font-bold">Followers</p>
                            <FollowDialog />
                        </div>
                        <div className="flex flex-col gap-5 max-w-2xl mx-auto">
                            {userInfo.followedBy.map((follower) => (
                                <div key={follower.id} className="flex flex-row justify-between items-center">
                                    <div className="flex flex-row justify-start items-center gap-3">
                                        <AvatarIcon image={follower.image} name={follower.name} size="small" />
                                        <p className="font-bold text-xl">{follower.name}</p>
                                    </div>
                                    <Button size="icon" variant="secondary" onClick={() => removeFollower(follower.id)}><X /></Button>
                                </div>
                            ))}
                        </div>
                        {userInfo.followedBy.length === 0 && (
                            <div className="w-100 h-100 flex justify-center flex-col items-center">
                                <Image src="/agent/empty.png" height={200} width={200} alt="" className="mt-10"/>
                                <p className="font-bold text-3xl mb-5">No Followers (Yet)</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="following" className="mt-5">
                        <div className="w-100 flex flex-row justify-between items-center mb-5">
                            <p className="text-3xl font-bold">Following</p>
                            <FollowDialog />
                        </div>
                        <div className="flex flex-col gap-5 max-w-2xl mx-auto">
                            {userInfo.following.map((follower) => (
                                <div key={follower.id} className="flex flex-row justify-between items-center">
                                    <div className="flex flex-row justify-start items-center gap-3">
                                        <AvatarIcon image={follower.image} name={follower.name} size="small" />
                                        <p className="font-bold text-xl">{follower.name}</p>
                                    </div>
                                    <Button size="icon" variant="secondary" onClick={() => removeFollowing(follower.id)}><X /></Button>
                                </div>
                            ))}
                        </div>
                        {userInfo.following.length === 0 && (
                            <div className="w-100 h-100 flex justify-center flex-col items-center">
                                <Image src="/agent/empty.png" height={200} width={200} alt="" className="mt-10"/>
                                <p className="font-bold text-3xl mb-5">Not Following Anybody</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="requests" className="mt-5">
                        <div className="w-100 flex flex-row justify-between items-center mb-5">
                            <p className="text-3xl font-bold">Requests</p>
                            <FollowDialog />
                        </div>
                        <div className="flex flex-col gap-5 max-w-2xl mx-auto">
                            {receivedFollows.map((request) => (
                                <div key={request.sender.id} className="flex flex-row justify-between items-center">
                                    <div className="flex flex-row justify-start items-center gap-3">
                                        <AvatarIcon image={request.sender.image} name={request.sender.name} size="small" />
                                        <p className="font-bold text-xl">{request.sender.name}</p>
                                    </div>
                                    <div className="flex flex-row justify-end items-center mt-5 gap-3">
                                        <Button variant="secondary" size="icon" onClick={() => respondFR(true, request.sender.id)}><Check className="h-4 w-4"/></Button>
                                        <Button variant="outline" size="icon" onClick={() => respondFR(false, request.sender.id)}><X className="h-4 w-4"/></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {receivedFollows.length === 0 && (
                            <div className="w-100 h-100 flex justify-center flex-col items-center">
                                <Image src="/agent/empty.png" height={200} width={200} alt="" className="mt-10"/>
                                <p className="font-bold text-3xl mb-5">No Follow Requests</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="notifications" className="mt-5">
                        <div className="w-100 flex flex-row justify-between items-center mb-5">
                            <p className="text-3xl font-bold">Notifications</p>
                        </div>
                        <div className="max-w-2xl mx-auto">
                            <Card className="mb-4 rounded-none">
                                <CardHeader>
                                    <div className="flex flex-row items-center justify-between space-y-0 gap-3">
                                        <div className="flex flex-row justify-start items-center gap-3">
                                            <Image src="/icons/COW Logo.svg" alt="Discord Logo" height={50} width={50} />
                                            <div>
                                                <CardTitle className="text-2xl">Discord</CardTitle>
                                                {!userInfo.discordConnection && <p className="text-muted-foreground">Get notifications straight to your DM&#39;s</p>}
                                                {userInfo.discordConnection && <p className="text-muted-foreground">Connected on: {format(new Date(userInfo.discordConnection.createdAt), "M/dd/yyyy hh:mm a")}</p>}
                                            </div>
                                        </div>
                                        {userInfo.discordConnection &&
                                            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-green-500/10">
                                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                                            </div>
                                        }
                                    </div>
                                </CardHeader>
                                <CardContent className="border-b">
                                    {!userInfo.discordConnection && <p>Set up your EventStar account to connect with your Discord account so you can get EventStar updates as they come in.</p>}
                                    {userInfo.discordConnection && discordInfo &&
                                        <div className="flex flex-row gap-4">
                                            <div className="flex flex-col gap-3 w-1/2">
                                                <p className="font-bold">Connected to:</p>
                                                <div className="flex flex-row items-center gap-4">
                                                    <AvatarIcon image={discordInfo.avatar} size="small" name={discordInfo.name} />
                                                    <p className="fw-bold text-lg">{discordInfo.global_name? discordInfo.global_name : discordInfo.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3 w-1/2">
                                                <p className="font-bold">Default Frequency:</p>
                                                <p className="text-lg">Level {userInfo.discordConnection.defaultFreq}</p>
                                            </div>
                                        </div>
                                    }
                                </CardContent>
                                {userInfo.discordConnection && <CardFooter className="gap-4 flex flex-row justify-between items-start p-6 bg-muted/30">
                                    <Form {...freqForm}>
                                        <form
                                            onSubmit={freqForm.handleSubmit(onSubmitFrequency)}
                                            className="flex flex-row gap-4 items-start"
                                        >
                                            <FormField
                                                control={freqForm.control}
                                                name="freq"
                                                render={({ field }) => (
                                                    <FormItem className="w-full max-w-md">
                                                        <FormControl>
                                                            <Select
                                                                value={field.value?.toString()}
                                                                onValueChange={(value) => field.onChange(value)}
                                                                disabled={loading}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select notification frequency" />
                                                                </SelectTrigger>

                                                                <SelectContent>
                                                                    <SelectItem value="0">
                                                                        0 — No notifications
                                                                    </SelectItem>

                                                                    <SelectItem value="1">
                                                                        1 — Essential (event created, 1 hour before start)
                                                                    </SelectItem>

                                                                    <SelectItem value="2">
                                                                        2 — Standard (RSVP + event reminders)
                                                                    </SelectItem>

                                                                    <SelectItem value="3">
                                                                        3 — All notifications (most reminders)
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="flex flex-row gap-4 items-center justify-start">
                                                <Button type="submit" disabled={loading} variant="secondary">
                                                    Save notification settings
                                                </Button>
                                                {notificationResponse === 1 && <Check className="h-4 w-4 text-green-500" />}
                                                {notificationResponse === 2 && <X className="h-4 w-4 text-red-500" />}
                                            </div>
                                        </form>
                                    </Form>
                                </CardFooter>}
                                {!userInfo.discordConnection && <CardFooter className="gap-4 flex flex-row justify-between items-start p-6 bg-muted/30">
                                    <Link href="/profile/discordSetup"><Button variant="default">Set up</Button></Link>
                                </CardFooter>}
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <br className="mt-20"/>
            <Footer />
        </>
    );
}