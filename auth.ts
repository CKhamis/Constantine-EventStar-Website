import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import {PrismaClient} from "@prisma/client";
import GitHub from "@auth/core/providers/github";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
        strategy: "database",
    },
    adapter: PrismaAdapter(prisma),
    providers: [GitHub],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!account) {
                console.error("Account is null or undefined");
                return false; // Reject sign-in
            }

            // Intercept the sign-in process
            const existingUser = user.email
                ? await prisma.user.findUnique({
                    where: { email: user.email },
                })
                : null;

            if (existingUser) {
                // Link the account to the existing user
                console.log("we seen you before!--------------------")
                await prisma.account.upsert({
                    where: {
                        provider_providerAccountId: {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                        },
                    },
                    update: {
                        userId: existingUser.id,
                    },
                    create: {
                        userId: existingUser.id,
                        type: account.type,
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                        access_token: account.access_token,
                        refresh_token: account.refresh_token,
                        expires_at: account.expires_at,
                    },
                });
            } else {
                // Customize account creation behavior here
                const newUser = await prisma.user.create({
                    data: {
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        // Add other default fields or process as necessary
                    },
                });

                await prisma.account.create({
                    data: {
                        userId: newUser.id,
                        type: account.type,
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                        access_token: account.access_token,
                        refresh_token: account.refresh_token,
                        expires_at: account.expires_at,
                    },
                });
            }
            return true; // Continue with the sign-in process
        },
    },
})