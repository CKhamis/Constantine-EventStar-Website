import {DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Guest} from "@prisma/client";

interface Props {
    guest: Guest;
}

export default function EditGuestForm({guest}:Props){
    const handleInputChange = () => {console.log("poop")}
    const handleSaveGuest = () => {console.log("poop")}

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={guest?.avatarUrl} alt={`${guest?.firstName} ${guest?.lastName}`} />
                        <AvatarFallback>{guest?.firstName[0]}{guest?.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <DialogTitle className="text-2xl font-semibold">Edit Guest Details</DialogTitle>
                </div>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">First Name</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        value={guest?.firstName || ''}
                        onChange={handleInputChange}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastName" className="text-right">Last Name</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        value={guest?.lastName || ''}
                        onChange={handleInputChange}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phoneNumber" className="text-right">Phone Number</Label>
                    <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={guest?.phoneNumber || ''}
                        onChange={handleInputChange}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={guest?.email || ''}
                        onChange={handleInputChange}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="discordID" className="text-right">Discord ID</Label>
                    <Input
                        id="discordID"
                        name="discordID"
                        value={guest?.discordId || ''}
                        onChange={handleInputChange}
                        className="col-span-3"
                    />
                </div>
            </div>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <p>Date Created: {new Date(guest.createdAt).toLocaleDateString()}</p>
                <p>Last Updated: {new Date(guest.updatedAt).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-end">
                <Button onClick={handleSaveGuest}>Save changes</Button>
            </div>
        </DialogContent>
    );
}