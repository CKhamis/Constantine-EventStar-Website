import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy:"jwt"
    },
    providers: [
        GitHub,
        CredentialsProvider({
            name: 'EventStar',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'terence@terence.com',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                }
            },
            async authorize(credentials){
                const user = {id: '1', name: 'Costi', email: "terence@terence.com"}
                return user;
            }
        })
    ],
    debug:true
})