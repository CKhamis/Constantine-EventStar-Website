import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import {Button} from "./ui/button";
import {CircleUser, } from "lucide-react"
import Link from "next/link"
import {Avatar} from "@/components/ui/avatar";
import { Session } from "next-auth";
import AvatarIcon from "@/components/AvatarIcon";

interface Props {
    session: Session | null;
}

export default async function AccountButton({ session }: Props){
    if(session && session.user){
        console.log("RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT")
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button suppressHydrationWarning variant="secondary" size="icon" className="rounded-full h-10 w-10">
                        <Avatar>
                            <AvatarIcon name={session.user.name} image={session.user.image} size="xsmall"/>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link href="/profile"><DropdownMenuLabel>{session.user.name}</DropdownMenuLabel></Link>
                    {session.user.role === "ADMIN"?
                        <>
                            <DropdownMenuSeparator/>
                            <Link href={"/ESMT"}><DropdownMenuItem>ESMT</DropdownMenuItem></Link>
                        </>
                        :
                        <></>
                    }

                    <Link href="/profile"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                    <DropdownMenuSeparator/>
                    <Link href={"/api/auth/signout?callbackUrl=/"}>
                        <DropdownMenuItem>Log Out</DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }else{
        console.log("RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT 2")
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button suppressHydrationWarning  variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-10 w-10"/>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem><Link href="/api/auth/signin">Sign In</Link></DropdownMenuItem>
                    {/*<DropdownMenuItem><Link href="https://costionline.com/SignUp">Sign Up</Link></DropdownMenuItem>*/}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
}