"use client"
import AdminUI from "@/components/admin/AdminUI";
import NewEventForm from "@/app/ESMT/calendar/new/NewEventForm";

export default function AdminCalendar(){
    return (
        <AdminUI>
            <div className="container mt-4 max-w-xl">
                <h1 className="text-3xl mb-4">Create New Event</h1>
                <NewEventForm />
            </div>
        </AdminUI>
    );
}