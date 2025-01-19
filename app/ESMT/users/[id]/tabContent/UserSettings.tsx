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

    async function deleteOauth(accountId: string) {
        try {
            await axios.post(`/api/esmt/users/deleteOauth`, {id: accountId}).finally(refreshAction);
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
        } catch (e) {
            console.log(e);
            setStatusText2(
                <p className="text-sm text-destructive text-center">There was an issue deleting the session</p>
            )
        }
    }

    return (
        <>
            <p className="text-2xl font-bold">Sign In Providers</p>
            <p className="text-sm text-muted-foreground">These are the different options associated with the given
                account.</p>
            {statusText}
            <Table className="mt-5">
                <TableCaption>This user has a total of {accountList.length} providers</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Provider</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead>Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accountList.map((provider) => (
                        <TableRow key={provider.id}>
                            <TableCell className="flex flex-row justify-start gap-4 items-center h-100">
                                <Image
                                    src={`https://logo.clearbit.com/${provider.provider}.com`}
                                    alt={`${provider.provider} logo`}
                                    width={35}
                                    height={35}
                                    className="rounded-full"
                                />
                                <p className="font-bold text-lg">{provider.provider}</p>
                            </TableCell>
                            <TableCell>{provider.expires_at? (provider.expires_at, 'PPP') : "None"}</TableCell>
                            <TableCell>{format(provider.createdAt, 'PPP')}</TableCell>
                            <TableCell>{format(provider.updatedAt, 'PPP')}</TableCell>
                            <TableCell><Button variant="destructive" onClick={() => deleteOauth(provider.id)}>Delete</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>


            <p className="text-2xl font-bold mt-10">User Sessions</p>
            <p className="text-sm text-muted-foreground">These are the currently active sessions associated with the user. Deleting a session will require the user to log in again</p>
            {statusText2}
            <Table className="mt-5">
                <TableCaption>This user has a total of {accountList.length} sessions.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
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