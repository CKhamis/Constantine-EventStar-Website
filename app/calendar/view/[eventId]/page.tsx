import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

async function fetchEventInfo() {
    try {
        const response = await axios.get("http://localhost:3000/api/events/view/6784aab7-14a9-4652-a6a1-1cde664ab66d");
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching event info:", error);
        return null;
    }
}

export default async function ViewEvent() {

    const event = await fetchEventInfo();
    console.log(event);

    if (!event) {
        return (
            <>
                <TopBar />
                <div className="container mt-4 flex flex-row justify-center items-center min-h-[600]">
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <p className="text-xl font-bold">Event not found.</p>
                        <Link href="/calendar">
                            <div className="flex flex-row gap-2 items-center mb-4">
                                    <Button variant="secondary" size="icon">
                                        <ChevronLeft/>
                                    </Button>
                                <p className="text-lg">Back to Events</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <TopBar/>
            <div className="container mt-4">
                <div className="flex flex-row gap-2 items-center mb-4">
                    <Link href="/calendar">
                        <Button variant="secondary" size="icon">
                        <ChevronLeft />
                        </Button>
                    </Link>
                    <p className="text-lg font-bold">Back to Events</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3 md:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{event.description}</p>
                                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                                {/* Add other event details here */}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-span-3 md:col-span-1 bg-amber-800">
                        Sidebar content
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
