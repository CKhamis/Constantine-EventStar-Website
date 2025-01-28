import AdminUI from "@/components/admin/AdminUI";
import DynamicContent from "./DynamicContent";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    return (
        <AdminUI>
            <DynamicContent eventId={eventId} />
        </AdminUI>
    );

}