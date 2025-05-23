"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import AvatarIcon from "@/components/AvatarIcon"
import axios from "axios"

interface Props {
    action: (selectedGuestIds: string[]) => void
    initialSelectedIds?: string[]
}

export default function UserSelect({ action, initialSelectedIds = [] }: Props) {
    const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set(initialSelectedIds))
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [followers, setFollowers] = useState<
        { id: string; name: string; email: string; image: string; phoneNumber: string }[]
    >([])

    // Update selectedGuests when initialSelectedIds changes
    useEffect(() => {
        if (initialSelectedIds && initialSelectedIds.length > 0) {
            setSelectedGuests(new Set(initialSelectedIds))
        }
    }, [initialSelectedIds])

    useEffect(() => {
        getFollowers()
    }, [])

    async function getFollowers() {
        try {
            setIsLoading(true)
            const response = await axios.get("/api/user/info")
            setFollowers(response.data.followedBy)
            setIsLoading(false)
        } catch (err) {
            console.error("Error fetching users:", err)
            setIsLoading(false)
        }
    }

    const handleGuestToggle = (guestId: string) => {
        setSelectedGuests((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(guestId)) {
                newSet.delete(guestId)
            } else {
                newSet.add(guestId)
            }
            return newSet
        })
    }

    const handleSubmit = () => {
        action(Array.from(selectedGuests))
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="flex items-center justify-center gap-2 w-full">
                    <Users className="w-4 h-4" />
                    Select Guests
                    {selectedGuests.size > 0 && (
                        <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-semibold">
              {selectedGuests.size}
            </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Select Guests</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <p>Loading guests...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                            {followers.map((guest) => (
                                <div
                                    key={guest.id}
                                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                                        selectedGuests.has(guest.id) ? "border-primary border-2 bg-primary/10" : "hover:bg-secondary"
                                    }`}
                                    onClick={() => handleGuestToggle(guest.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            handleGuestToggle(guest.id)
                                            e.preventDefault()
                                        }
                                    }}
                                >
                                    <AvatarIcon image={guest.image} name={guest.name} />
                                    <div className="text-center">
                                        <p className="font-medium">{guest.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        Confirm Selection ({selectedGuests.size})
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}