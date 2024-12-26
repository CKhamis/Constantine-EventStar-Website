import DynamicContent from "./DynamicContent";


type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}



export default async function Page(props: { params: Params }){
    const params = await props.params
    const ticketId = params.id;

    return (<DynamicContent ticketId={ticketId} />);
}