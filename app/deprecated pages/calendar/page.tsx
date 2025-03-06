import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import {redirect} from "next/navigation";
// import DynamicContent from "@/app/calendar/DynamicContent";
import {auth} from "@/auth";

export default async function page(){
    const session =  await auth();

    if (!session || !session.user || !session.user.id){
        redirect("/api/auth/signin");
    }

    return(
        <>
            <TopBar/>
                <DynamicContent userId={session.user.id} />
            <Footer/>
        </>
    )
}