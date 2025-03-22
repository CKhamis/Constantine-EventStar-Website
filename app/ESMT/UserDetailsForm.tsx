import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {esmtUser} from "@/app/api/ESMT/user/all/route";
import {useState} from "react";
import axios from "axios";
import AvatarIcon from "@/components/AvatarIcon";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";

interface Props {
    user: esmtUser;
    refresh: () => void;
    id: string
}

export default function UserDetailsForm({id, user, refresh}:Props){

    async function solicit(id:string){
        try{
            await axios.post('/api/ESMT/user/connections/new', {id: id})
                .finally(refresh);
        }catch(e){
            console.log(e);
        }

    }

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // const deleteUser = async (id: string) => {
    //     setIsDialogOpen(false);
    //     try{
    //         await axios.post('/api/esmt/users/delete', {"id": id}).finally(refresh);
    //         addMessage({ title: "User Deleted", message: "User and all related information was deleted from server", icon: 1 });
    //     }catch(e){
    //         addMessage({ title: "Unable to Delete User", message: "There was an issue deleting user", icon: 2 });
    //         console.log(e);
    //     }
    // }

    return (
        <Dialog key={user.id} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer">
                    <AvatarIcon name={user.name} image={user.image} />
                    <div>
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    <div className="flex flex-col items-center space-y-4">
                        <AvatarIcon name={user.name} image={user.image} size="large" />
                        <DialogTitle className="text-2xl font-semibold">{user.name}</DialogTitle>
                    </div>
                </DialogHeader>
                <DialogBody className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-2">
                        <p className="text-xl font-bold">Email</p>
                        <p>{user.email ? user.email : "None"}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <p className="text-xl font-bold">Phone</p>
                        <p>{user.phoneNumber ? user.phoneNumber : "None"}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <p className="text-xl font-bold">Discord</p>
                        <p>{user.discordId ? user.discordId : "None"}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <p className="text-xl font-bold">Role</p>
                        <p>{user.role ? user.role : "None"}</p>
                    </div>
                </DialogBody>
                <DialogFooter className="justify-end">
                <DialogClose asChild>
                    <Button type="submit" variant="outline">
                            Close
                        </Button>
                    </DialogClose>
                    {!(user.id === id)? (
                        user.following.find((m) => m.id === id)? (
                            <Button variant="secondary" type="button" disabled>
                                Already Following
                            </Button>
                        ) : (
                            <Button variant="secondary" type="button" onClick={() => solicit(user.id)}>
                                Solicit
                            </Button>
                        )
                    ) : <></>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}