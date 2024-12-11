import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import AvatarIcon from "@/components/AvatarIcon";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import ProfileForm from "@/app/profile/ProfileForm";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default async function ProfilePage() {
    const session = await auth();

    if (!session || !session.user || !session.user.id){
        redirect("/api/auth/signin");
    }

    return (
        <>
            <TopBar/>
            <div className="container mt-4">
                <div className="flex justify-between gap-4 mb-4">
                    <h1 className="text-3xl">User Profile</h1>
                    <Badge>{session.user.role}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 flex flex-col gap-5">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-row justify-between items-center gap-4">
                                    <div className="flex flex-row gap-4 items-center">
                                        <AvatarIcon image={session.user.image} name={session.user.name} size="large"/>
                                        <div>
                                            <p className="text-lg font-bold">{session.user.name}</p>
                                            <p>{session.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="flex flex-row justify-evenly items-center gap-4">
                                    <div className="flex flex-col items-center gap-3">
                                        <p className="font-bold">Date Joined</p>
                                        <p className="text-2xl">{new Date(session.user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-3">
                                        <p className="font-bold">Last Modified</p>
                                        <p className="text-2xl">{new Date(session.user.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                    <div className="md:col-span-2 mb-5">
                        <Tabs defaultValue="profile" className="w-[400px]">
                            <TabsList>
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="events">Events</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>
                            <TabsContent value="profile">
                                <p className="text-2xl font-bold mb-4">Profile Information</p>
                                <ProfileForm user={session.user} />
                            </TabsContent>
                            <TabsContent value="events">Change your password here.</TabsContent>
                            <TabsContent value="settings">Change your settings here.</TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}