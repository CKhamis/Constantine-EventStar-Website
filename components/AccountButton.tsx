import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import {Button} from "./ui/button";
import {CircleUser,} from "lucide-react"
import Link from "next/link"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function AccountButton(){
    const session:boolean = false;
    if(session){
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/icons/Logo.svg" alt="Avatar" />
                            <AvatarFallback>SD</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{}</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <form>
                        <DropdownMenuItem>
                            <Button variant="ghost" type="submit" className="h-5 p-0">Log Out</Button>
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
                    <DropdownMenuItem><Link href="/">Register</Link></DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem><Link href="/login">Sign In</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link href="https://costionline.com/SignUp">Sign Up</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
}