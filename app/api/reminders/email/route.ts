import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import {cardEnrollmentSchema} from "@/components/ValidationSchemas";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

//const prisma = new PrismaClient();

export async function GET() {

    //const body = await request.json();

    await resend.emails.send({
        from: 'Evil Costi <onboarding@resend.dev>',
        to: 'email@gmail.com',
        subject: 'Hello World',
        html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
    return NextResponse.json("yay", { status: 200 });

}
