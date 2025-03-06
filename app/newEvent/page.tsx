import MainNav from "@/components/MainNav";
import DynamicContent from "@/app/newEvent/DynamicContent";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export default async function page(){
    const session = await auth();

    if(!session || !session.user){
        redirect("/api/auth/signin");
    }

    return(
        <MainNav>
            <DynamicContent />
        </MainNav>
    )
}