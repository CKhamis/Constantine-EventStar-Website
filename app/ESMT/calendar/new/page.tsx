import AdminUI from "@/components/admin/AdminUI";
import NewEventForm from "@/app/ESMT/calendar/new/NewEventForm";
import {auth} from "@/auth";

export default async function AdminCalendar(){
    const session = await auth();

    return (
        <AdminUI>
            <div className="container mt-4 max-w-xl">
                <h1 className="text-3xl mb-4">Create New Event</h1>
                {(!session || !session.user || !session.user.id)? null: <NewEventForm userId={session.user.id}/>}
            </div>
        </AdminUI>
    );
}