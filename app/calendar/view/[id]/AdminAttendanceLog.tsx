"use client"
import {useEffect, useState} from "react";
import axios from "axios";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Users} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import AvatarIcon from "@/components/AvatarIcon";
import {RsvpWithUser} from "@/components/Types";

export interface Props{
    eventId: string;
}

export default function AdminAttendanceLog({eventId}: Props) {
    const [rsvps, setRsvps] = useState<RsvpWithUser[]>([]);
    const [numPresent, setNumPresent] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Initial fetch
    const fetchRsvps = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/rsvp/users/${eventId}`);
            setRsvps(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error("Error fetching users:", err)
            setIsLoading(false)
        }
    }

    // Subsequent fetches
    async function markPresent(id: string) {
        try {
            //setIsLoading(true)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/esmt/events/attendance/${eventId}`, {id: id});
            setRsvps(response.data)
            //setIsLoading(false)
        } catch (err) {
            console.error("Error fetching users:", err)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setNumPresent(rsvps.filter(rsvp => rsvp.arrival).length);
    }, [rsvps]);

    useEffect(() => {
        fetchRsvps()
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    className="flex items-center justify-center gap-2 w-full"
                >
                    <Users className="w-4 h-4" />
                    Guest Attendance
                    {numPresent > 0 &&
                        (<span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-semibold">{numPresent}</span>)
                    }
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Select Guests Who Arrived {numPresent > 0 && `[${numPresent}/${rsvps.length}]`}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                    {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <p>Loading guests...</p>
                            </div>
                        ) :
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                            {rsvps.map(rsvpguest => (
                                <div
                                    key={rsvpguest.id}
                                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${rsvpguest.arrival ? 'border-primary border-2 bg-primary/10' : 'hover:bg-secondary'}`}
                                    onClick={() => markPresent(rsvpguest.User.id)}
                                    role="buton"
                                    tabIndex={0}
                                >
                                    <AvatarIcon image={rsvpguest.User.image} name={rsvpguest.User.name}/>
                                    <div className="text-center">
                                        <p className="font-medium">{rsvpguest.User.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </ScrollArea>
                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}