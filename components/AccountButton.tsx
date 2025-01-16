import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import {Button} from "./ui/button";
import {CircleUser, PersonStanding,} from "lucide-react"
import Link from "next/link"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {auth} from "@/auth";

export default async function AccountButton(){
    const session = await auth();
    if(session && session.user){
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <Avatar className="h-9 w-9 sm:flex">
                            {session.user.image && <AvatarImage src={session.user.image} alt={`${session.user.name}`}/>}
                            {session.user && <AvatarFallback>{session.user.name}</AvatarFallback>}
                            <AvatarFallback><PersonStanding /></AvatarFallback>
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
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5"/>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem><Link href="/api/auth/signin">Sign In</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link href="https://costionline.com/SignUp">Sign Up</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
}