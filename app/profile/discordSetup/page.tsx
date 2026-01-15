import MainNav from "@/components/MainNav";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import DynamicContent from "@/app/profile/discordSetup/DynamicContent";

export default async function page(){
    const session = await auth();

    if(!session || !session.user){
        redirect("/api/auth/signin");
    }

    return(
        <DynamicContent id={session.user.id} />
    )
}