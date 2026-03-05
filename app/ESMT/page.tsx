import MainNav from "@/components/MainNav";
import DynamicContent from "@/app/ESMT/DynamicContent";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export default async function page(){
    const session = await auth();
    const noisyEnabled:boolean = process.env.NOISY_URL !== undefined && process.env.NOISY_URL !== "";

    if(!session || !session.user || session.user.role !== "OWNER" || !session.user.id){
        redirect("/");
    }

    return(
        <MainNav>
            <DynamicContent id={session.user.id} noisyEnabled={noisyEnabled} />
        </MainNav>
    )
}