import DynamicContent from "@/app/tutorial/DynamicContent";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export default async function Page(){
    const session = await auth();

    if (!session || !session.user || !session.user.id){
        redirect("/api/auth/signin");
    }

    return (
        <DynamicContent id={session.user.id} />
    );
}