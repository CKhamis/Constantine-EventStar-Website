'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users } from 'lucide-react'
import { User } from "@prisma/client"

interface Props {
    onGuestsSelected: (selectedGuestIds: string[]) => void
    initialSelectedGuests?: string[]
}

export default function UserSelection({ onGuestsSelected, initialSelectedGuests = [] }: Props) {
    const [users, setUsers] = useState<User[]>([])
    const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set(initialSelectedGuests))
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get("/api/esmt/users/all")
                setUsers(response.data)
                setIsLoading(false)
            } catch (err) {
                console.error("Error fetching users:", err)
                setError("Failed to load users. Please try again.")
                setIsLoading(false)
            }
        }

        fetchGuests()
    }, [])

    useEffect(() => {
        setSelectedGuests(new Set(initialSelectedGuests))
    }, [initialSelectedGuests])

    const handleGuestToggle = (guestId: string) => {
        setSelectedGuests(prev => {
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
        onGuestsSelected(Array.from(selectedGuests))
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    className="flex items-center justify-center gap-2 w-full"
                >
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
                    ) : error ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                            {users.map(guest => (
                                <div
                                    key={guest.id}
                                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                                        selectedGuests.has(guest.id) ? 'border-primary border-2 bg-primary/10' : 'hover:bg-secondary'
                                    }`}
                                    onClick={() => handleGuestToggle(guest.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleGuestToggle(guest.id)
                                            e.preventDefault()
                                        }
                                    }}
                                >
                                    <Avatar className="w-16 h-16 mb-2">
                                        <AvatarImage src={guest.image || undefined} alt={`${guest.name}`} />
                                        <AvatarFallback>{guest.name? guest.name[0] : "?"}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-center">
                                        <p className="font-medium">{guest.name}</p>
                                        {/*<p className="text-sm text-muted-foreground">{guest.email}</p>*/}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading || !!error}>
                        Confirm Selection ({selectedGuests.size})
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

