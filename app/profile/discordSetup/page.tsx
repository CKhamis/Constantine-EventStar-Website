import {auth} from "@/auth";
import {redirect} from "next/navigation";
import DynamicContent from "@/app/profile/discordSetup/DynamicContent";

export default async function page(){
    const session = await auth();
    const noisyEnabled:boolean = process.env.NOISY_URL !== undefined && process.env.NOISY_URL !== "";

    if(!session || !session.user){
        redirect("/api/auth/signin");
    }

    //todo: (discord) make an error page here if noisy is not connected
    return(
        <DynamicContent id={session.user.id} />
    )
}