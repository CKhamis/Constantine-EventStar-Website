import Link from "next/link"
import {Menu} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import Image from "next/image";
import {DialogTitle} from "@/components/ui/dialog";
import AccountButton from "@/components/AccountButton";

export default function TopBar() {
    const links = [
        {label: "Home", href: "/"},
        {label: "Events", href: "/calendar"},
        {label: "Costi Online", href: "https://costionline.com"},
    ];

    return (
        <header className="sticky backdrop-blur top-0 h-16 gap-4 border-b top-left-gradient px-4 md:px-6 flex justify-between items-center z-[10]">
            <div className="flex flex-row items-center justify-start gap-2">
                <Link href="/">
                    <Image src={`/icons/Logo.svg`} alt={`Event Star Logo`} width={35} height={35} className="hover-minimize"/>
                </Link>
                <Link href="/" className="text-foreground transition-colors hover:text-foreground font-bold text-lg">
                    EventStar
                </Link>
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ml-4">
                    {links.map((link) => <Link key={link.href} href={link.href} className="text-foreground hover-underline text-base mx-1">{link.label}</Link>)}
                </nav>
            </div>
            <div className="flex flex-row items-center justify-end gap-6">
                <AccountButton />
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                            <Menu className="h-5 w-5"/>
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link href="/" className="flex-row flex gap-3">
                                <Image src={`/icons/Logo.svg`} alt={`Event Star Logo`} width={30} height={30} className="hover-minimize"/>
                                <p className="font-bold text-2xl">EventStar</p>
                            </Link>
                            {links.map((link) => <Link key={link.href} href={link.href} className="hover:text-foreground hover-underline">{link.label}</Link>)}
                            <Link href="/profile" className="hover:text-foreground hover-underline">Profile</Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}