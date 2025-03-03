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
import Image from 'next/image'
import {format} from "date-fns";
import axios from "axios";
import {Account} from "@prisma/client";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {Check, X} from "lucide-react";
import {userWithEventAndGroupsAndRsvpAndAccountsAndSessions} from "@/components/Types";

export interface Props{
    accountList: Account[];
    refreshAction: () => Promise<void>;
    user: userWithEventAndGroupsAndRsvpAndAccountsAndSessions;
}

export default function UserSettings({accountList, refreshAction, user}: Props) {


    const [statusText, setStatusText] = useState<ReactElement>(<></>);
    const [statusText2, setStatusText2] = useState<ReactElement>(<></>);

    async function toggleNewEmailPreferences(newEmails: boolean) {
        console.log(newEmails);
        try {
            await axios.post(`/api/esmt/users/communicationPreferences`, {id: user.id, emailNewEvents: newEmails})
                .then(refreshAction);
        } catch (e) {
            console.log(e);
        }
    }

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
                            <TableCell>{provider.expires_at ? (provider.expires_at, 'PPP') : "None"}</TableCell>
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


            <p className="text-2xl font-bold mt-10">Communication Preferences</p>
            <p className="text-sm text-muted-foreground">These are the currently active sessions associated with the user. Deleting a session will require the user to log in again</p>
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
                            <ToggleGroup type="single" defaultValue={user.newEventEmails ? "acc" : "deny"}>
                                <ToggleGroupItem value="acc" aria-label="Accept" onClick={() => toggleNewEmailPreferences(true)}>
                                    <Check className="h-4 w-4"/>
                                </ToggleGroupItem>
                                <ToggleGroupItem value="deny" aria-label="Deny" onClick={() => toggleNewEmailPreferences(false)}>
                                    <X className="h-4 w-4"/>
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    );
}