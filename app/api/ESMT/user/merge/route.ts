import { PrismaClient } from "@prisma/client"
import { type NextRequest, NextResponse } from "next/server"
import {esmtMergeFormSchema} from "@/components/ValidationSchemas"
import { auth } from "@/auth"

const prisma = new PrismaClient()

/**
 * Very powerful endpoint that combines two users. This includes accounts, RSVPs
 * @param request contains two user ids and basic information
 * @constructor
 */
export async function POST(request: NextRequest) {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json("Approved login required", { status: 401 })
    }

    const body = await request.json()

    const validation = esmtMergeFormSchema.safeParse(body)

    if (!validation.success) {
        return NextResponse.json(validation.error.format(), { status: 400 })
    }

	if(body.hostId === body.secondaryId){
		return NextResponse.json("Secondary and Host ids are incorrect.", { status: 400 })
	}

    try {
        // Check if both users exists
	    const [host, secondary] = await Promise.all([
		    prisma.user.findUniqueOrThrow({
			    where: {
				    id: body.hostId
			    },
			    select:{
					id: true,
				    name: true,
				    email: true,
				    discordId: true,
				    phoneNumber: true,
				    event: true,
				    rsvp: true,
				    following: true,
				    followedBy: true,
				    accounts: true,
				    recievedRequests: true,
				    sentRequests: true,
			    }
		    }),
		    prisma.user.findUniqueOrThrow({
			    where: {
				    id: body.secondaryId
			    },
			    select:{
				    id: true,
				    name: true,
				    email: true,
				    discordId: true,
				    phoneNumber: true,
				    event: true,
				    rsvp: true,
				    following: true,
				    followedBy: true,
				    accounts: true,
				    recievedRequests: true,
				    sentRequests: true,
			    }
		    })
	    ])

	    try{
		    // Transaction for an all-or-nothing procedure
		    await prisma.$transaction(async (tx) => {

			    // 1. Update host's basic fields
			    await tx.user.update({
				    where: { id: host.id },
				    data: {
					    name: body.name,
					    email: body.email,
					    discordId: body.discordId,
					    phoneNumber: body.phone,
				    }
			    });

			    // 2. Transfer all events
			    await tx.event.updateMany({
				    where: { authorId: secondary.id },
				    data: { authorId: host.id }
			    });

			    // 3. Transfer Auth / Accounts
			    await tx.account.updateMany({
				    where: { userId: secondary.id },
				    data: { userId: host.id }
			    });

			    // 4. Transfer RSVPs (skip duplicates)
			    const hostEventIds = host.rsvp.map(r => r.eventId);

			    // Delete duplicates
			    await tx.rsvp.deleteMany({
				    where: {
					    userId: secondary.id,
					    eventId: { in: hostEventIds }
				    }
			    });

			    // Transfer remaining
			    await tx.rsvp.updateMany({
				    where: { userId: secondary.id },
				    data: { userId: host.id }
			    });

			    // 5. Transfer Followers
			    const hostFollowerIds = host.followedBy.map(u => u.id);
			    const secondaryFollowerIds = secondary.followedBy.map(u => u.id);

			    const followersToAdd = secondaryFollowerIds
				    .filter(id => id !== host.id && !hostFollowerIds.includes(id))
				    .map(id => ({ id }));

			    // Disconnect secondary from followers
			    await tx.user.update({
				    where: { id: secondary.id },
				    data: {
					    followedBy: {
						    disconnect: secondary.followedBy.map(f => ({ id: f.id }))
					    }
				    }
			    });

			    // Connect followers to host
			    if (followersToAdd.length > 0) {
				    await tx.user.update({
					    where: { id: host.id },
					    data: {
						    followedBy: {
							    connect: followersToAdd
						    }
					    }
				    });
			    }

			    // 6. Transfer Following
			    const hostFollowingIds = host.following.map(u => u.id);
			    const secondaryFollowingIds = secondary.following.map(u => u.id);

			    const followingToAdd = secondaryFollowingIds
				    .filter(id => id !== host.id && !hostFollowingIds.includes(id))
				    .map(id => ({ id }));

			    // Disconnect secondary following
			    await tx.user.update({
				    where: { id: secondary.id },
				    data: {
					    following: {
						    disconnect: secondary.following.map(f => ({ id: f.id }))
					    }
				    }
			    });

			    // Connect host to new following
			    if (followingToAdd.length > 0) {
				    await tx.user.update({
					    where: { id: host.id },
					    data: {
						    following: { connect: followingToAdd }
					    }
				    });
			    }

			    // 7. Transfer Follow Requests
			    for (const req of secondary.recievedRequests) {
				    // Avoid duplicate request relationships
				    await tx.followRequest.update({
					    where: { id: req.id },
					    data: { receiverId: host.id }
				    });
			    }

			    for (const req of secondary.sentRequests) {
				    await tx.followRequest.update({
					    where: { id: req.id },
					    data: { senderId: host.id }
				    });
			    }

			    // 8. Delete secondary user
			    await tx.user.delete({
				    where: { id: secondary.id }
			    });

		    });


		    return NextResponse.json({ message: "Two users have successfully merged" }, { status: 200 })
	    }catch(err){
			console.error(err)
		    return NextResponse.json({ message: "An error occurred with information transfer. Information reverted." }, { status: 500 })
	    }

    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: "An error occurred" }, { status: 500 })
    }
}