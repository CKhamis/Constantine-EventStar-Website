'use client'
import AvatarIcon from "@/components/AvatarIcon";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import {FormControl} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

export interface Props {
    userName: string,
    userEmail: string,
    userImage: string,
    isAuthor: boolean,
    userId: string,
    isFollowing: boolean,
    action: () => void,
    response: string,
    eventId: string,
    guests: number,
}

export default function GuestListItem({userName, eventId, userImage, response, userEmail, isAuthor, userId, isFollowing, action, guests = 0}: Props){
    const [FRMessage, setFRMessage] = useState<string>("");

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

    async function overwriteRSVP(response:string) {
        try{
            await axios.post('/api/events/authorControl/changeRSVP/' + eventId, {response: response, id: userId})
                .then((r: {data: string}) => {toast("RSVP Overwritten", {description: r.data})})
                .catch((r: {response: {data: string}}) => {toast("Error", {description: r.response.data})});
        }catch(e){
            console.log(e)
        }finally {
            action();
        }
    }

    let content: JSX.Element;

    if(isAuthor){
        // viewer is the author. Show tools
        content = (
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex flex-col items-center space-y-4">
                        <AvatarIcon name={userName} image={userImage} size="large" />
                        <DialogTitle className="text-2xl font-semibold">{userName}</DialogTitle>
                    </div>
                </DialogHeader>
                <div className="flex flex-col space-y-4 mt-5">
                    <div>
                        <p className="text-center font-bold mb-2">Overwrite RSVP Status</p>
                        <ToggleGroup type="single" defaultValue={response}>
                            <ToggleGroupItem value="YES" aria-label="YES" onClick={() => overwriteRSVP("YES")}>
                                <Check className="h-8 w-8" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="NO" aria-label="NO" onClick={() => overwriteRSVP("NO")}>
                                <X className="h-8 w-8" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="MAYBE" aria-label="MAYBE" onClick={() => overwriteRSVP("MAYBE")}>
                                <CircleHelp className="h-8 w-8" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="NO_RESPONSE" aria-label="NO_RESPONSE" onClick={() => overwriteRSVP("NO_RESPONSE")}>
                                <Clock className="h-8 w-8" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div>
                        {/*<FormControl>*/}
                        {/*    <Input*/}
                        {/*        type="number"*/}
                        {/*        min="0"*/}
                        {/*        max={eventInfo?.maxGuests}*/}
                        {/*        placeholder="0"*/}
                        {/*        {...field}*/}
                        {/*        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}*/}
                        {/*        value={field.value || 0}*/}
                        {/*    />*/}
                        {/*</FormControl>*/}
                    </div>
                </div>
                <div className="grid gap-4 pt-4">
                    {isFollowing ? (
                        <div className="flex flex-col space-y-3">
                            <Button type="button" variant="secondary" disabled>Following</Button>
                            {/*<Button type="submit">Save changes</Button>*/}
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            <div className="grid">
                                <Button type="button" variant="secondary" onClick={() => sendFR(userEmail)}>Follow</Button>
                                <p className="text-center text-muted-foreground">{FRMessage}</p>
                            </div>
                            {/*<Button type="submit">Save changes</Button>*/}
                        </div>
                    )}
                </div>
            </DialogContent>
        );
    }else if(userId !== ""){
        // viewer has a non invited account
        content = (
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex flex-col items-center space-y-4">
                        <AvatarIcon name={userName} image={userImage} size="large" />
                        <DialogTitle className="text-2xl font-semibold">{userName}</DialogTitle>
                        <p className="text-center">{userEmail}</p>
                    </div>
                </DialogHeader>
                <div className="grid pt-4">
                    {isFollowing? (
                        <Button type="button" variant="secondary" disabled>Following</Button>
                    ) : (
                        <>
                            <Button type="button" variant="default" onClick={() => sendFR(userEmail)}>Follow</Button>
                            <p className="text-center text-muted-foreground">{FRMessage}</p>
                        </>
                    )}
                </div>
            </DialogContent>
        );
    }else{
        // viewer is a non-logged in guest
        content = (
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Login Required</DialogTitle>
                    <DialogDescription>
                        Please log in with an account to view guest details and follow.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-row justify-center items-center mb-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    <AvatarIcon name={userName} image={userImage}/>
                    <div>
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-sm text-muted-foreground">{userEmail}</p>
                    </div>
                </div>
                <p className="text-muted-foreground text-xl">{guests > 0? "+" + guests : ""}</p>
            </div>
        </DialogTrigger>
        {content}
    </Dialog>
    );
}