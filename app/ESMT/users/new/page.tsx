import AdminUI from "@/components/admin/AdminUI";
import NweUserForm from "@/app/ESMT/users/new/NewUserForm";
export default function Page(){
    return (
        <AdminUI>
            <div className="container mt-4 max-w-xl">
                <h1 className="text-3xl mb-4">Add New User</h1>
                <NweUserForm />
            </div>
        </AdminUI>
    );
}