'use client'
import AvatarIcon from "@/components/AvatarIcon";
import {
    Dialog,
    DialogContent, DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import {useState} from "react";
import {Check, CircleHelp, Clock, X} from "lucide-react"
import { toast } from "sonner"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {Input} from "@/components/ui/input";

export interface Props {
    RSVP:{
        id: string,
        response: string,
        guests: number,
        firstName: string | undefined,
        lastName: string | undefined,
        user: {
            email: string,
            name: string,
            image: string
            id: string,
        } | undefined,
    },
    isFollowing: boolean,
    action: () => void,
    eventId: string,
    maxGuests: number,
    viewerRole: "A" | "V" | "W",
    authorId: string,
    viewerId: string | null,
}

export default function GuestListItem({RSVP, viewerRole, isFollowing, action, eventId, maxGuests, authorId, viewerId}: Props){
    const [FRMessage, setFRMessage] = useState<string>("");
    const [guestCount, setGuestCount] = useState(RSVP.guests);

    let nameSafe: string;
    let emailSafe: string;
    let imageSafe: string;

    if(RSVP.user){
        // EventStar user
        nameSafe = RSVP.user.name;
        emailSafe = RSVP.user.email;
        imageSafe = RSVP.user.image;
    }else if(RSVP.firstName && RSVP.lastName){
        // Write-In guest
        nameSafe = RSVP.firstName + " " + RSVP.lastName;
        emailSafe = "Write-In Guest";
        imageSafe = "";
    }else{
        // Error
        console.error("Unable to render RSVP:" + RSVP);
        nameSafe = "Invalid RSVP";
        emailSafe = "Error";
        imageSafe = "";
    }

    async function sendFR(email:string) {
        try{
            await axios.post('/api/user/connections/newRequest', {email: email})
                .then((r: {data: {message: string}}) => {setFRMessage(r.data.message)})
                .catch((r: {response: {data: {message: string}}}) => {setFRMessage(r.response.data.message)});
        }catch(e){
            console.log(e)
        }finally {
            action();
        }
    }

    async function overwriteRSVP(response:string, guestOverride: number = RSVP.guests) {
        try{
            await axios.post('/api/events/authorControl/changeRSVP/' + eventId, {response: response, id: RSVP.id, guests: guestOverride})
                .then((r: {data: string}) => {toast("RSVP Overwritten", {description: r.data})})
                .catch((r: {response: {data: string}}) => {toast("Error", {description: r.response.data})});
        }catch(e){
            console.log(e)
        }finally {
            console.log(guestOverride)
            action();
        }
    }

    let content: JSX.Element;

    if(viewerRole == "A"){
        // Viewer is author

        if(RSVP.user){
            // Author is viewing a guest with an account

            if(RSVP.user.id === authorId){
                // Author is viewing their own RSVP
                content = (
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <div className="flex flex-col items-center space-y-4">
                                <AvatarIcon name={nameSafe} image={imageSafe} size="large" />
                                <DialogTitle className="text-2xl font-semibold">{nameSafe}</DialogTitle>
                                <p className="text-center">{emailSafe}</p>
                            </div>
                        </DialogHeader>
                        <div className="flex flex-col space-y-4 mt-5">
                            <div>
                                <p className="text-center font-bold mb-2">Overwrite RSVP Status</p>
                                <ToggleGroup type="single" defaultValue={RSVP.response}>
                                    <ToggleGroupItem value="YES" onClick={() => overwriteRSVP("YES")}>
                                        <Check className="h-8 w-8" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="NO" onClick={() => overwriteRSVP("NO")}>
                                        <X className="h-8 w-8" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="MAYBE" onClick={() => overwriteRSVP("MAYBE")}>
                                        <CircleHelp className="h-8 w-8" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="NO_RESPONSE" onClick={() => overwriteRSVP("NO_RESPONSE")}>
                                        <Clock className="h-8 w-8" />
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            <div>
                                <p className="text-sm">+1s (Max {maxGuests})</p>
                                <Input
                                    type="number"
                                    min="0"
                                    max={maxGuests}
                                    value={guestCount}
                                    onChange={(e) => {
                                        const g = e.target.valueAsNumber || 0;
                                        setGuestCount(g);
                                        overwriteRSVP(RSVP.response, g);
                                    }}
                                />
                            </div>
                        </div>
                    </DialogContent>
                );
            }else{
                // Author is viewing another EventStar user's RSVP
                content = (
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <div className="flex flex-col items-center space-y-4">
                                <AvatarIcon name={nameSafe} image={imageSafe} size="large" />
                                <DialogTitle className="text-2xl font-semibold">{nameSafe}</DialogTitle>
                                <p className="text-center">{emailSafe}</p>
                            </div>
                        </DialogHeader>
                        <div className="flex flex-col space-y-4 mt-5">
                            <div>
                                <p className="text-center font-bold mb-2">Overwrite RSVP Status</p>
                                <ToggleGroup type="single" defaultValue={RSVP.response}>
                                    <ToggleGroupItem value="YES" onClick={() => overwriteRSVP("YES")}>
                                        <Check className="h-8 w-8" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="NO" onClick={() => overwriteRSVP("NO")}>
                                        <X className="h-8 w-8" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="MAYBE" onClick={() => overwriteRSVP("MAYBE")}>
                                        <CircleHelp className="h-8 w-8" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="NO_RESPONSE" onClick={() => overwriteRSVP("NO_RESPONSE")}>
                                        <Clock className="h-8 w-8" />
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            <div>
                                <p className="text-sm">+1s (Max {maxGuests})</p>
                                <Input
                                    type="number"
                                    min="0"
                                    max={maxGuests}
                                    value={guestCount}
                                    onChange={(e) => {
                                        const g = e.target.valueAsNumber || 0;
                                        setGuestCount(g);
                                        overwriteRSVP(RSVP.response, g);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 pt-4">
                            {emailSafe && (
                                isFollowing ? (
                                    <Button type="button" variant="secondary" disabled>Following</Button>
                                ) : (
                                    <div className="flex flex-col space-y-4">
                                        <div className="grid">
                                            <Button type="button" variant="secondary" onClick={() => sendFR(emailSafe)}>Follow</Button>
                                            <p className="text-center text-muted-foreground">{FRMessage}</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </DialogContent>
                );
            }
        }else if(RSVP.firstName && RSVP.lastName){
            // Author viewing a guest account
            content = (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="flex flex-col items-center space-y-4">
                            <AvatarIcon name={nameSafe} image={imageSafe} size="large" />
                            <DialogTitle className="text-2xl font-semibold">{nameSafe}</DialogTitle>
                            <p className="text-center">{emailSafe}</p>
                        </div>
                    </DialogHeader>
                    <div className="grid pt-4">
                        {/*TODO: implement deleting RSVPS*/}
                        <Button type="button" variant="secondary">Delete write-in</Button>
                    </div>
                </DialogContent>
            );

        }else{
            // Something wrong happened. Malformed RSVP
            content = (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Error Viewing User</DialogTitle>
                        <DialogDescription>
                            RSVP information was malformed!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-row justify-center items-center mb-5">
                        <img src="/agent/error.gif" alt="Error" />
                    </div>
                    <DialogFooter>
                        {/*TODO: implement deleting RSVPS*/}
                        <Button type="button" variant="default">Delete RSVP</Button>
                        <Button type="button" variant="secondary">Close</Button>
                    </DialogFooter>
                </DialogContent>
            );
        }
    }else if(viewerRole == "V"){
        // Viewer is normal guest

        if(RSVP.user){
            if(RSVP.user.id === viewerId){
                // Guest is viewing themselves

                content = (
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <div className="flex flex-col items-center space-y-4">
                                <AvatarIcon name={nameSafe} image={imageSafe} size="large" />
                                <DialogTitle className="text-2xl font-semibold">{nameSafe}</DialogTitle>
                                <p className="text-center">{emailSafe}</p>
                            </div>
                        </DialogHeader>
                        <Link href="/profile" className="w-full">
                            <Button type="button" variant="secondary" className="w-full">
                                Profile
                            </Button>
                        </Link>
                    </DialogContent>
                );

            }else{
                // Guest with account is viewing another guest with account (can be organizer)
                content = (
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <div className="flex flex-col items-center space-y-4">
                                <AvatarIcon name={nameSafe} image={imageSafe} size="large" />
                                <DialogTitle className="text-2xl font-semibold">{nameSafe}</DialogTitle>
                                <p className="text-center">{emailSafe}</p>
                            </div>
                        </DialogHeader>
                        <div className="grid pt-4">
                            {isFollowing ? (
                                <Button type="button" variant="secondary" disabled>Following</Button>
                            ) : (
                                <>
                                    {emailSafe && (
                                        <Button type="button" variant="default" onClick={() => sendFR(emailSafe)}>Follow</Button>
                                    )}
                                    <p className="text-center text-muted-foreground">{FRMessage}</p>
                                </>
                            )}
                        </div>
                    </DialogContent>
                );
            }


        }else if(RSVP.firstName && RSVP.lastName){
            // EventStar user viewing a Write-in guest

            content = (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="flex flex-col items-center space-y-4">
                            <AvatarIcon name={nameSafe} image={imageSafe} size="large" />
                            <DialogTitle className="text-2xl font-semibold">{nameSafe}</DialogTitle>
                            <p className="text-center">{emailSafe}</p>
                        </div>
                    </DialogHeader>
                </DialogContent>
            );

        }else{
            // Something wrong happened. Malformed RSVP
            content = (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Error Viewing User</DialogTitle>
                        <DialogDescription>
                            RSVP information was malformed!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-row justify-center items-center mb-5">
                        <img src="/agent/error.gif" alt="Error" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary">Close</Button>
                    </DialogFooter>
                </DialogContent>
            );
        }

    }else if(viewerRole == "W"){
        // Viewer is write-in guest
        content = (
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex flex-col items-center space-y-4">
                        <AvatarIcon name={nameSafe} image={imageSafe} size="large"/>
                        <DialogTitle className="text-2xl font-semibold">{nameSafe}</DialogTitle>
                        <p className="text-center">{emailSafe}</p>
                    </div>
                </DialogHeader>
                <Link href="/api/auth/signin" className="w-full">
                    <Button type="button" variant="secondary" className="w-full">
                        Sign in / Create Account
                    </Button>
                </Link>
            </DialogContent>
        );
    } else {
        // Something very wrong happened. Impossible with prop type
        content = (
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Error Viewing User</DialogTitle>
                    <DialogDescription>
                        There was an issue verifying your account
                    </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-row justify-center items-center mb-5">
                        <img src="/agent/error.gif" alt="Error" />
                    </div>
                    <DialogFooter>
                        <Link href="/api/auth/signin"><Button type="button" variant="default">Log In</Button></Link>
                        <Button type="button" variant="secondary">Close</Button>
                    </DialogFooter>
                </DialogContent>
            );
    }

    return (
    <Dialog>
        <DialogTrigger asChild>
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex space-x-4 items-center">
                    <AvatarIcon name={nameSafe} image={imageSafe}/>
                    <div>
                        <p className="text-sm font-medium leading-none">{nameSafe}</p>
                        <p className="text-sm text-muted-foreground">{emailSafe}</p>
                    </div>
                </div>
                <p className="text-muted-foreground text-xl">{RSVP.guests > 0? "+" + RSVP.guests : ""}</p>
            </div>
        </DialogTrigger>
        {content}
    </Dialog>
    );
}