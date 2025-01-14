import AdminUI from "@/components/admin/AdminUI";
import DynamicContent from "@/app/ESMT/groups/new/DynamicContent";
import {auth} from "@/auth";

export default async function Page(){
    const session = await auth();

    return (
        <AdminUI>
            <div className="container mt-4 max-w-xl">
                <h1 className="text-3xl mb-4">Create New Group</h1>
                {(!session || !session.user || !session.user.id)? null: <DynamicContent />}
            </div>
        </AdminUI>
    );
}