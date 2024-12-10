import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import Image from "next/image";
import AvatarIcon from "@/components/AvatarIcon";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

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
                    </div>
                    <div className="flex flex-row justify-between items-center gap-4">
                        <div className="flex flex-row gap-4 items-center">
                            <AvatarIcon image={session.user.image} name={session.user.name} size="large" />
                            <div>
                                <p className="text-lg font-bold">{session.user.name}</p>
                                <p>{session.user.email}</p>
                            </div>
                        </div>
                    </div>
                    <Tabs defaultValue="account" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">Make changes to your account here.</TabsContent>
                        <TabsContent value="password">Change your password here.</TabsContent>
                    </Tabs>
                </div>
            <Footer/>
        </>
    )
}