'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OAuthProvider } from './types/oauth-provider'
import Image from 'next/image'
import {AccountResponse} from "@/components/Types";
import {formatDate} from "date-fns";
import AvatarIcon from "@/components/AvatarIcon";


export default function AccountSettings({accountList}: {accountList: AccountResponse[]}) {
    const [selectedProvider, setSelectedProvider] = useState<OAuthProvider | null>(null);

    return (
        // accountList.map((account) => (
        //     <div key={account.id} className="flex-row align-items-center items-center justify-between">
        //         <div>
        //
        //         </div>
        //         <div className="flex flex-col gap-2">
        //             <p className="text-xl font-bold">{account.provider.toUpperCase()}</p>
        //             <p className="text-secondary-foreground text-xs">Created: {formatDate(account.createdAt, "PPP")}</p>
        //         </div>
        //     </div>
        // ))

        <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {accountList.map((provider) => (
                <Dialog key={provider.id}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full h-auto py-4 px-2 flex flex-col items-center justify-center gap-2"
                            onClick={() => setSelectedProvider(provider)}
                        >
                            <Image
                                src={`https://logo.clearbit.com/${provider.provider}.com`}
                                alt={`${provider.provider} logo`}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <span className="font-semibold">{provider.provider.toUpperCase()}</span>
                            <span className="text-xs text-muted-foreground">
                    Added: {formatDate(provider.createdAt, "MM/dd/yyyy")}
                  </span>
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
                        <DialogFooter className="sm:justify-start mt-5">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setSelectedProvider(null)}
                            >
                                Close
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => console.log("rat")}
                            >
                                Disconnect
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ))}
</div>
</ScrollArea>
    );
}