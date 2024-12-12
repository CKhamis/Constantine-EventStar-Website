import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {Badge} from "@/components/ui/badge";
import DynamicContent from "@/app/profile/DynamicContent";

export default async function ProfilePage() {
    const session = await auth();

    if (!session || !session.user || !session.user.id){
        redirect("/api/auth/signin");
    }

    return (
        <>
            <TopBar/>
            <div className="container mt-4">
                <div className="flex justify-between gap-4 mb-4">
                    <h1 className="text-3xl">User Profile</h1>
                    <Badge>{session.user.role}</Badge>
                </div>
                <DynamicContent/>
            </div>
            <Footer/>
        </>
    )
}