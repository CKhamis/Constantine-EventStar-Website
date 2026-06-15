import {PropsWithChildren} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import AccountButton from "@/components/AccountButton";
import {auth} from "@/auth";

export default async function MainNav({children}: PropsWithChildren){
    const session = await auth();

    const menuItems = [
        {title: 'Feed', iconUrl: '/icons/Feed.svg', link: '/feed'},
        {title: 'New Event', iconUrl: '/icons/NewEvent.svg', link: '/eventDetails'},
    ];

    if(session && session.user && session.user.role === "OWNER"){
        menuItems.push({title: 'ESMT', iconUrl: '/icons/ESMT.svg', link: '/ESMT'})
    }

    return(
        <TooltipProvider>
            <div className="flex flex-col lg:flex-row justify-start gap-0 m-0 p-0 h-screen w-screen overflow-y-hidden">
	            {/* Main Nav Bar */}
	            <div className="flex flex-row lg:flex-col justify-between align-center border-r-2 h-full left-0 p-2 gap-4">
		            <Tooltip>
			            <TooltipTrigger>
				            <Link href="/" className="">
					            <Image src="/icons/Logo.svg" alt="rat" width={40} height={40} className="m-0 hover-minimize"/>
				            </Link>
			            </TooltipTrigger>
			            <TooltipContent>
				            <p>EventStar</p>
			            </TooltipContent>
		            </Tooltip>

		            <div className="flex flex-col gap-6 mt-2 overflow-y-auto no-scrollbar flex-grow">
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
            </div>
        </TooltipProvider>
    )
}