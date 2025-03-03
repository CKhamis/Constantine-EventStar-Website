import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";
import { auth } from "@/auth"
import axios from "axios";

// Request
type RequestReport = {
    domain_id:string,

    ip:string,
    client_port:string,
    client_user:string,
    client_locale:string,

    session:string,
    cookies:string,

    request_uri:string,
    request_url:string,
    request_method:string,
    request_header:string,
    request_protocol:string,
    request_scheme:string,

    user_agent:string,
}

export async function POST(request: NextRequest){
    const session =  await auth();

    const report: RequestReport = {
        domain_id: "EventStar",
        ip: request.headers.get("x-forwarded-for")?? "unknown",
        client_port: request.nextUrl.port,
        client_user: session?.user?.id?? "None",
        client_locale: request.nextUrl.defaultLocale?? "?",
        session: session?.expires?? "Unknown",
        cookies: request.cookies.getAll().map((cookie) => cookie.name.toString() + ": " + cookie.value.toString()).join(", "),
        request_uri: request.nextUrl.pathname,
        request_url: request.url,
        request_method: request.method.toString(),
        request_header: request.headers.get("Accept")?? "None",
        request_protocol: "HTTP:/1.1",
        request_scheme: request.nextUrl.protocol,
        user_agent: request.headers.get("User-Agent")?? "None"
    }

    await axios.post("http://localhost:8080/report", report)
    return NextResponse.next();
}