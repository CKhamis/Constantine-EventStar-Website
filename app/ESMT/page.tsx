import MainNav from "@/components/MainNav";
import DynamicContent from "@/app/ESMT/DynamicContent";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export default async function page(){
    const session = await auth();

    if(!session || !session.user || session.user.role !== "OWNER"){
        redirect("/");
    }

    return(
        <MainNav>
            <DynamicContent />
        </MainNav>
    )
}