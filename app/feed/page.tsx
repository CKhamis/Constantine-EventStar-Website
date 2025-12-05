import MainNav from "@/components/MainNav";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import DynamicContent from "@/app/feed/DynamicContent";

export default async function Page(){
    const session = await auth();

    if(!session || !session.user){
        redirect("/api/auth/signin?callbackUrl=/feed");
    }

    return (
        <MainNav>
            <DynamicContent />
        </MainNav>
    );
}