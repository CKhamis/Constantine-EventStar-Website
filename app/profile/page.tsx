import MainNav from "@/components/MainNav";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import DynamicContent from "@/app/profile/DynamicContent";

export default async function Page(){
    const session = await auth();

    if(!session || !session.user){
        redirect("/api/auth/signin");
    }

    return (
        <MainNav>
            <DynamicContent session={session} />
        </MainNav>
    );
}