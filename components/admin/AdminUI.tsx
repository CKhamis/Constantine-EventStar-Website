import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {SideBar} from "./SideBar";
import BreadcrumbNavigation from "@/components/admin/BreadcrumbNavigation";
import {PropsWithChildren} from "react";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export default async function AdminUI({children}: PropsWithChildren){
    const session = await auth();

    if (!session || !session.user || !session.user.id || session.user.role !== "ADMIN"){
        redirect("/api/auth/signin");
    }

    return (
        <>
            <SidebarProvider>
                <SideBar />
                <SidebarInset>
                    <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b pr-6">
                        <div className="flex justify-between items-center gap-2 px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <BreadcrumbNavigation />
                        </div>
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}