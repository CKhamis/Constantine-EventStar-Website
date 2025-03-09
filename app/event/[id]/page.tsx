import MainNav from "@/components/MainNav";
import DynamicContent from "@/app/event/[id]/DynamicContent";
import {auth} from "@/auth";

type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}

export default async function ViewEventPage(props: { params: Params }){
    const params = await props.params
    const eventId = params.id;

    const session = await auth();

    return (
        <MainNav>
            <DynamicContent eventId={eventId} userId={session? (session.user? session.user.id : "") : ""} />
        </MainNav>
    );
}