import AdminUI from "@/components/admin/AdminUI";
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import Link from "next/link";
import DynamicContent from "@/app/ESMT/groups/[id]/DynamicContent";

type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }):Promise<string> {
    const params = await props.params
    return params.id
}


export default async function EditGroup(props: { params: Params }){
    const params = await props.params
    const groupId = params.id;

    return (
        <AdminUI>
            <div className="container mt-4 max-w-xl">
                <div className="flex flex-row gap-2 items-center">
                    <Link href="/ESMT/groups">
                        <Button variant="outline" size="icon">
                            <ChevronLeft/>
                        </Button>
                    </Link>
                    <p className="text-lg">Back to overview</p>
                </div>
                <h1 className="text-2xl font-bold my-4">Edit Group</h1>
                <DynamicContent groupId={groupId} />
            </div>
        </AdminUI>
    );
}