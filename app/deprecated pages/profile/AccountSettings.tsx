'use client'

import {ReactElement, useState} from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Bold, Check, Italic, Underline, X} from "lucide-react"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area"
import Image from 'next/image'
import {formatDate} from "date-fns";
import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import axios from "axios";
import {Account, User} from "@prisma/client";

export interface Props{
    accountList: Account[];
    refresh: () => Promise<void>;
    user: User;
}

export default function AccountSettings({accountList, refresh, user}: Props) {
    const [statusText, setStatusText] = useState<ReactElement>(<></>);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

    async function deleteOauth(accountId: string) {
        try {
            await axios.post(`/api/users/connectedAccounts/delete`, {id: accountId});
            setIsDialogOpen(false);
            refresh();
        } catch (e) {
            console.log(e);
            setStatusText(
                <p className="text-sm text-destructive text-center">You need 2 or more accounts to delete</p>
            )
        }
    }

    async function toggleNewEmailPreferences(newEmails: boolean) {
        console.log(newEmails);
        try {
            await axios.post(`/api/users/communicationPreferences`, {emailNewEvents: newEmails})
                .then(refresh);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <p className="text-xl font-bold">Sign In Providers</p>
            <p className="text-sm text-muted-foreground">These are the different options you can sign into your EventStar account with.</p>
            <ScrollArea className="whitespace-nowrap mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {accountList.map((provider) => (
                        <Dialog key={provider.id} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-auto h-auto py-4 px-2 flex flex-col items-center justify-center gap-2"
                                >
                                    <Image
                                        src={`https://logo.clearbit.com/${provider.provider}.com`}
                                        alt={`${provider.provider} logo`}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <span className="font-semibold">{provider.provider.toUpperCase()}</span>
                                    <span className="text-xs text-muted-foreground">Added: {formatDate(provider.createdAt, "MM/dd/yyyy")}</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[300px]">
                                <DialogHeader>
                                    <div className="flex flex-col items-center space-y-4">
                                        <Image
                                            src={`https://logo.clearbit.com/${provider.provider}.com`}
                                            alt={`${provider.provider} logo`}
                                            width={50}
                                            height={50}
                                            className="rounded-full"
                                        />
                                        <DialogTitle className="text-2xl font-semibold">{provider.provider.toUpperCase()}</DialogTitle>
                                    </div>
                                </DialogHeader>
                                <DialogDescription className="text-center">
                                    Connected on: {formatDate(provider.createdAt, "MM/dd/yyyy")}
                                </DialogDescription>
                                <DialogDescription className="text-center">
                                    Last updated: {formatDate(provider.updatedAt, "MM/dd/yyyy")}
                                </DialogDescription>
                                {statusText}
                                <DialogFooter className="sm:justify-center">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => deleteOauth(provider.id)}
                                    >
                                        Disconnect
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ))}
                    <Button
                        variant="outline"
                        className="w-auto h-auto py-4 px-2 flex flex-col items-center justify-center gap-2"
                        onClick={() => router.push('/api/auth/signin')}
                    >
                        <Plus style={{width: '40px', height: '40px'}}/>
                        <span className="font-semibold">Add New</span>
                    </Button>

                </div>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
            <p className="text-xl font-bold mt-8">Communication Preferences</p>
            <p className="text-sm text-muted-foreground">These are the various forms of communications EventStar will contact you through. Currently, only email is supported.</p>
            <Table className="mt-5">
                <TableHeader>
                    <TableRow>
                        <TableHead>Events</TableHead>
                        <TableHead className="text-center">Email Address</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">Event Creation</TableCell>
                        <TableCell className="w-[150]">
                            <ToggleGroup type="single" defaultValue={user.newEventEmails? "acc" : "deny"}>
                                <ToggleGroupItem value="acc" aria-label="Accept" onClick={() => toggleNewEmailPreferences(true)}>
                                    <Check className="h-4 w-4" />
                                </ToggleGroupItem>
                                <ToggleGroupItem value="deny" aria-label="Deny" onClick={() => toggleNewEmailPreferences(false)}>
                                    <X className="h-4 w-4" />
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

        </>
    );
}