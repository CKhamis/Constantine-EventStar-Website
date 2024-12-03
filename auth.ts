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
})