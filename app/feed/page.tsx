import MainNav from "@/components/MainNav";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import AvatarIcon from "@/components/AvatarIcon";

export default async function Page(){
    const session = await auth();

    if(!session || !session.user){
        redirect("/api/auth/login");
    }

    return (
        <MainNav>
            <div className="w-100 h-screen grid grid-cols-2 lg:grid-cols-3 gap-0 p-0">
                <div className="w-100 col-span-2 items-centers overflow-y-scroll">
                    <div className="container flex-col flex gap-3 p-5 max-w-3xl">
                        <p className="text-3xl font-bold mb-5">Upcoming Events</p>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                        <div className="bg-amber-900 w-100 p-10">Terence!</div>
                    </div>
                </div>
                <div className="hidden lg:flex border-l-2">
                    <div className="max-w-xl mx-auto">
                        <div className="flex flex-row gap-3 justify-start items-center mt-5 p-5">
                            <AvatarIcon size="large" image={session.user.image} name={session.user.name} />
                            <div>
                                <p className="font-bold text-2xl">{session.user.name}</p>
                                <p className="ml-1 text-muted-foreground">{session.user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainNav>
    );
}