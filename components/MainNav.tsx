import {PropsWithChildren} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import AccountButton from "@/components/AccountButton";

export default function MainNav({children}: PropsWithChildren){

    return(
        <TooltipProvider>
            <div className="flex flex-col lg:flex-row justify-start gap-0 m-0 p-0 h-screen w-screen">
                <div className="border-r-2 h-100 flex flex-col justify-between p-2">
                    <div>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link href="/" className="p-0">
                                    <Image src="/icons/Logo.svg" alt="rat" width={30} height={30} className="m-0"/>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Terence</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div>
                        <AccountButton />
                    </div>
                </div>
                <div className="h-100 flex-grow overflow-y-scroll">
                    {children}
                </div>
            </div>
        </TooltipProvider>
    )
}