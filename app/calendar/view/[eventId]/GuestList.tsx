import axios from "axios";
import {RsvpWithGuest} from "@/components/Types";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

interface Props{
    guestId: string,
    eventId: string,
}

// TODO: Make levels in displaying information here
export default async function GuestList({guestId, eventId}: Props) {

    async function fetchEvent() {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/rsvp/guests/${eventId}`);
            return response.data;
        } catch (err) {
            console.error("Error fetching event:", err);
            return null;
        }
    }

    try{
        const rawRsvpData:RsvpWithGuest[] = await fetchEvent();
        const rsvpData:RsvpWithGuest[] = rawRsvpData.filter((rsvp) => rsvp.Guest.id !== guestId);

        const rsvpYesCount = rsvpData.filter((rsvp) => rsvp.response === "YES").length;
        const rsvpNoCount = rsvpData.filter((rsvp) => rsvp.response === "NO").length;
        const rsvpMaybeCount = rsvpData.filter((rsvp) => rsvp.response === "MAYBE").length;
        const rsvpNoneCount = rsvpData.filter((rsvp) => rsvp.response === "NO_RESPONSE").length;

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Guest List</CardTitle>
                    <CardDescription>View guests who are invited and are attending this event. This list shows other members who have responded to the RSVP</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="yes" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="yes">Coming</TabsTrigger>
                            <TabsTrigger value="no">Not Coming</TabsTrigger>
                            <TabsTrigger value="maybe">Tentative</TabsTrigger>
                            <TabsTrigger value="no_response">No Reply</TabsTrigger>
                        </TabsList>
                        <TabsContent value="yes">
                            {rsvpData.filter((rsvp) => rsvp.response === "YES").map(rsvp => (
                                <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer" key={rsvp.id}>
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={rsvp.Guest.avatarUrl} alt={`${rsvp.Guest.firstName} ${rsvp.Guest.lastName}`}/>
                                        <AvatarFallback>{rsvp.Guest.firstName[0]}{rsvp.Guest.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{rsvp.Guest.firstName} {rsvp.Guest.lastName}</p>
                                        <p className="text-sm text-muted-foreground">{rsvp.Guest.email}</p>
                                    </div>
                                </div>
                            ))}
                            {rsvpYesCount===0? (
                                <p className="text-center mt-9 mb-6 font-bold">None</p>
                            ) : (<></>)}
                        </TabsContent>
                        <TabsContent value="no">
                            {rsvpData.filter((rsvp) => rsvp.response === "NO").map(rsvp => (
                                <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer" key={rsvp.id}>
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={rsvp.Guest.avatarUrl} alt={`${rsvp.Guest.firstName} ${rsvp.Guest.lastName}`}/>
                                        <AvatarFallback>{rsvp.Guest.firstName[0]}{rsvp.Guest.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{rsvp.Guest.firstName} {rsvp.Guest.lastName}</p>
                                        <p className="text-sm text-muted-foreground">{rsvp.Guest.email}</p>
                                    </div>
                                </div>
                            ))}
                            {rsvpNoCount===0? (
                                <p className="text-center mt-9 mb-6 font-bold">None</p>
                            ) : (<></>)}
                        </TabsContent>
                        <TabsContent value="maybe">
                            {rsvpData.filter((rsvp) => rsvp.response === "MAYBE").map(rsvp => (
                                <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer" key={rsvp.id}>
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={rsvp.Guest.avatarUrl} alt={`${rsvp.Guest.firstName} ${rsvp.Guest.lastName}`}/>
                                        <AvatarFallback>{rsvp.Guest.firstName[0]}{rsvp.Guest.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{rsvp.Guest.firstName} {rsvp.Guest.lastName}</p>
                                        <p className="text-sm text-muted-foreground">{rsvp.Guest.email}</p>
                                    </div>
                                </div>
                            ))}
                            {rsvpMaybeCount===0? (
                                <p className="text-center mt-9 mb-6 font-bold">None</p>
                            ) : (<></>)}
                        </TabsContent>
                        <TabsContent value="no_response">
                            {rsvpData.filter((rsvp) => rsvp.response === "NO_RESPONSE").map(rsvp => (
                                <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer" key={rsvp.id}>
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={rsvp.Guest.avatarUrl} alt={`${rsvp.Guest.firstName} ${rsvp.Guest.lastName}`}/>
                                        <AvatarFallback>{rsvp.Guest.firstName[0]}{rsvp.Guest.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{rsvp.Guest.firstName} {rsvp.Guest.lastName}</p>
                                        <p className="text-sm text-muted-foreground">{rsvp.Guest.email}</p>
                                    </div>
                                </div>
                            ))}
                            {rsvpNoneCount===0? (
                                <p className="text-center mt-9 mb-6 font-bold">Everyone has responded</p>
                            ) : (<></>)}
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">{rawRsvpData.length} total guests invited, {rsvpYesCount} others confirmed will be going, waiting for {rsvpNoneCount} to respond</p>
                </CardFooter>
            </Card>
        );
    } catch (e) {
        return (
            <>

            </>
        );
    }


}