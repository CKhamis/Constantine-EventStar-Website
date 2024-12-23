'use client'

import {AccountResponse} from "@/components/Types";
import {formatDate} from "date-fns";


export default function AccountSettings({accountList}: {accountList: AccountResponse[]}) {
    console.log(accountList);
    return (
        accountList.map((account) => (
            <div key={account.id} className="flex-row align-items-center items-center justify-between">
                <div>

                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-xl font-bold">{account.provider.toUpperCase()}</p>
                    <p className="text-secondary-foreground text-xs">Created: {formatDate(account.createdAt, "PPP")}</p>
                </div>
            </div>
        ))
    );
}