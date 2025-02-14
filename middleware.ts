// WebSpy Interceptor
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
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



// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    if(!process.env.WEBSPY_URL || process.env.WEBSPY_URL === "" || process.env.WEBSPY_URL === undefined){
        return NextResponse.next();
    }

    const report: RequestReport = {
        domain_id: "EventStar",
        ip: request.headers.get("x-forwarded-for")?? "unknown",
        client_port: request.nextUrl.port,
        client_user: "Unknown",
        client_locale: request.nextUrl.defaultLocale?? "?",
        session: "Unknown",
        cookies: request.cookies.getAll().map((cookie) => cookie.name.toString() + ": " + cookie.value.toString()).join(", "),
        request_uri: request.nextUrl.pathname,
        request_url: request.url,
        request_method: request.method.toString(),
        request_header: request.headers.get("Accept")?? "None",
        request_protocol: "HTTP:/1.1",
        request_scheme: request.nextUrl.protocol,
        user_agent: request.headers.get("User-Agent")?? "None"
    }

    try {
        // Axios is not supported in the Edge runtime for some reason
        const response = await fetch(process.env.WEBSPY_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(report)
        });

        if (response.ok) {
            return NextResponse.next();
        } else {
            return NextResponse.error();
        }
    } catch (e) {
        return NextResponse.error();
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/:path*',
}