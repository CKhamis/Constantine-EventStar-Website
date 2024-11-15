import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {SideBar} from "./SideBar";
import BreadcrumbNavigation from "@/components/admin/BreadcrumbNavigation";
import {PropsWithChildren} from "react";

export default function AdminUI({children}: PropsWithChildren){
    return (
        <>
            <SidebarProvider>
                <SideBar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                        <div className="flex items-center gap-2 px-3">
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