import AdminUI from "@/components/admin/AdminUI";
import UserInfo from "@/app/ESMT/users/[id]/UserInfo";

export default async function page({ params }: { params: Promise<{ id: string }> }){
    const resolvedParams = await params;
    const id = resolvedParams.id;

    return (
        <AdminUI>
            <UserInfo userId={id} />
        </AdminUI>
    );
}