import MainNav from "@/components/MainNav";
import DynamicContent from "@/app/event/[id]/DynamicContent";

type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}

export default async function ViewEventPage(props: { params: Params }){
    const params = await props.params
    const eventId = params.id;

    return (
        <MainNav>
            <DynamicContent eventId={eventId} />
        </MainNav>
    );
}