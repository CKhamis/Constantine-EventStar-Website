import AdminUI from "@/components/admin/AdminUI";
import AlertList, {alertContent} from "@/components/AlertList";
import {useState} from "react";

export default function AdminCalendar(){
    const [alertMessages, setAlertMessages] = useState<alertContent[]>([]);

    return (
        <AdminUI>
            <div className="container mt-4">
                <AlertList alerts={alertMessages} />

            </div>
        </AdminUI>
);
}