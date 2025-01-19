'use client'

import {ReactElement, useState} from 'react'
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import {format, formatDate} from "date-fns";
import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import axios from "axios";
import {Account} from "@prisma/client";

export interface Props{
    accountList: Account[];
    refreshAction: () => Promise<void>;
}

export default function UserSettings({accountList, refreshAction}: Props) {
    const [statusText, setStatusText] = useState<ReactElement>(<></>);
    const [statusText2, setStatusText2] = useState<ReactElement>(<></>);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    async function deleteOauth(accountId: string) {
        try {
            await axios.post(`/api/esmt/users/deleteOauth`, {id: accountId}).finally(refreshAction);
            setIsDialogOpen(false);
        } catch (e) {
            console.log(e);
            setStatusText(
                <p className="text-sm text-destructive text-center">You need 2 or more accounts to delete</p>
            )
        }
    }

    async function deleteSession(sessionId: string) {
        try {
            await axios.post(`/api/esmt/users/deleteSession`, {id: sessionId}).finally(refreshAction);
            setIsDialogOpen(false);
        } catch (e) {
            console.log(e);
            setStatusText2(
                <p className="text-sm text-destructive text-center">There was an issue deleting the session</p>
            )
        }
    }

    return (
        <>
            <p className="text-xl font-bold">Sign In Providers</p>
            <p className="text-sm text-muted-foreground">These are the different options associated with the given
                account.</p>
            <ScrollArea className="whitespace-nowrap mt-5">
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
                                    <span
                                        className="text-xs text-muted-foreground">Added: {formatDate(provider.createdAt, "MM/dd/yyyy")}</span>
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
                                        <DialogTitle
                                            className="text-2xl font-semibold">{provider.provider.toUpperCase()}</DialogTitle>
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
                </div>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>

            <p className="text-xl font-bold mt-10">User Sessions</p>
            <p className="text-sm text-muted-foreground">These are the currently active sessions associated with the user. Deleting a session will require the user to log in again</p>

            <Table className="mt-5">
                <TableCaption>A list of all associated sessions.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Token</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead>Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accountList.map((session) => (
                        <TableRow key={session.id}>
                            <TableCell>{session.id}</TableCell>
                            <TableCell>{session.access_token}</TableCell>
                            <TableCell>{session.expires_at ?? "Doesn't expire"}</TableCell>
                            <TableCell>{format(session.createdAt, 'PPP')}</TableCell>
                            <TableCell>{format(session.updatedAt, 'PPP')}</TableCell>
                            <TableCell><Button variant="destructive" onClick={() => deleteSession(session.id)}>Delete</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </>
    );
}