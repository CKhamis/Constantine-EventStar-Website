import {PropsWithChildren} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import AccountButton from "@/components/AccountButton";

export default function MainNav({children}: PropsWithChildren){
    const menuItems = [
        {title: 'Feed', iconUrl: '/icons/Feed.svg', link: '/feed'},
        {title: 'Events2', iconUrl: '/icons/Events.svg', link: '/calendar'}
    ];

    return(
        <TooltipProvider>
            <div className="flex flex-col lg:flex-row justify-start gap-0 m-0 p-0 h-screen w-screen">
                <div className="border-r-2 h-100 flex-col justify-between p-2 hidden lg:flex">
                    <div className="flex flex-col align-middle content-center gap-6 mt-2">
                        <Tooltip>
                            <TooltipTrigger>
                                <Link href="/" className="">
                                    <Image src="/icons/Logo.svg" alt="rat" width={40} height={40} className="m-0 hover-minimize"/>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Terence</p>
                            </TooltipContent>
                        </Tooltip>
                        {menuItems.map((item) => (
                            <Tooltip key={item.title}>
                                <TooltipTrigger>
                                    <Link href={item.link} className="p-0">
                                        <Image src={item.iconUrl} alt={item.title} width={40} height={40} className="m-0 hover-minimize"/>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                    <div>
                        <AccountButton />
                    </div>
                </div>
                <div className="border-b-2 w-100 flex-row justify-between flex lg:hidden sticky px-2 pt-1 backdrop-blur z-[10]">
                    <Link href="/" className="p-2">
                        <Image src="/icons/Logo.svg" alt="rat" width={40} height={40} className="m-0"/>
                    </Link>
                    {menuItems.map((item) => (
                        <div className="p-2" key={item.title}>
                            <Link href={item.link}  className="p-0">
                                <Image src={item.iconUrl} alt={item.title} width={40} height={40} className="m-0 hover-minimize"/>
                            </Link>
                        </div>
                    ))}
                    <div className="p-2">
                        <AccountButton/>
                    </div>
                </div>
                <div className="h-100 flex-grow overflow-y-scroll">
                {children}
                </div>
            </div>
        </TooltipProvider>
    )
}