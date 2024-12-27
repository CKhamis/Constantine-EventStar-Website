import UserEnrollment from "@/app/ESMT/users/enrollment/DynamicContent";
import AdminUI from "@/components/admin/AdminUI";

export default function page(){
    return (
        <AdminUI>
            <UserEnrollment />
        </AdminUI>
    );
}