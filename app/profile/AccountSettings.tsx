'use client'

import {ReactElement, useState} from 'react'
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
import {AccountResponse} from "@/components/Types";
import {formatDate} from "date-fns";
import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import axios from "axios";

export interface Props{
    accountList: AccountResponse[];
    refresh: () => Promise<void>;
}

export default function AccountSettings({accountList, refresh}: Props) {
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
                        <Plus style={{ width: '40px', height: '40px' }} />
                        <span className="font-semibold">Add New</span>
                    </Button>

                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </>
    );
}