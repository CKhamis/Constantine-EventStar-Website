import AdminUI from "@/components/admin/AdminUI";
import NewGuestForm from "@/app/ESMT/guests/new/NewGuestForm";

export default function AdminCalendar(){
    return (
        <AdminUI>
            <div className="container mt-4 max-w-xl">
                <h1 className="text-3xl mb-4">Add New Guest</h1>
                <NewGuestForm />
            </div>
        </AdminUI>
    );
}