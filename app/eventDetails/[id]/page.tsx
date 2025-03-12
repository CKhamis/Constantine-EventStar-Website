import MainNav from "@/components/MainNav";
import DynamicContent from "@/app/eventDetails/DynamicContent";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}

export default async function page(props: { params: Params }){
    const session = await auth();

    const params = await props.params
    const eventId = params.id;

    if(!session || !session.user){
        redirect("/api/auth/signin");
    }

    return(
        <MainNav>
            <DynamicContent eventId={eventId} />
        </MainNav>
    )
}