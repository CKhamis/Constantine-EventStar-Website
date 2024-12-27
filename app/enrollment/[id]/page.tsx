import DynamicContent from "./DynamicContent";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";


type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}



export default async function Page(props: { params: Params }){
    const params = await props.params
    const ticketId = params.id;

    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/enrollment/view`, {id: ticketId});
        console.log(response);
        return (<DynamicContent enrollerResponse={response.data} />);
    }catch(e){
        console.log(e);
        return (
            <div className="w-100 h-screen flex flex-col items-center justify-center p-10 top-left-gradient">
                <Image src="/agent/waiting.png" alt="waiting" height={150} width={150} />
                <p className="text-4xl font-bold text-center">OOPS! There was an error with the link</p>
                <p className="mt-3">Please contact the person sending you the link</p>
                <Link href="/" className="underline text-muted-foreground mt-3">Back to home page</Link>
            </div>
        );
    }
}