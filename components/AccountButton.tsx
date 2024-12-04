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
                        <Avatar className="hidden h-9 w-9 sm:flex">
                            {session.user.image && <AvatarImage src={session.user.image} alt={`${session.user.name}`}/>}
                            {session.user && <AvatarFallback>{session.user.name}</AvatarFallback>}
                            <AvatarFallback><PersonStanding /></AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <form>
                        <DropdownMenuItem>
                            <Link href={"/api/auth/signout?callbackUrl=/"}><Button variant="ghost" type="submit" className="h-5 p-0">Log Out</Button></Link>
                        </DropdownMenuItem>
                    </form>
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