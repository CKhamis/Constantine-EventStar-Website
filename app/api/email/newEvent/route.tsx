import {NextRequest, NextResponse} from "next/server";
import { Resend } from 'resend';
import {emailNewEventRequest} from "@/components/Types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    const body:emailNewEventRequest = await request.json();

    await resend.emails.send({
        from: 'EventStar <onboarding@resend.dev>',
        to: body.to,
        scheduledAt: body.scheduledAt,
        subject: body.subject,
        // react: <NewEvent eventStart={body.eventStart} eventEnd={body.eventEnd} eventName={body.eventName} eventDescription={body.eventDescription} />
        html: `
      <div style="font-family: Arial, sans-serif; background-color: black; padding: 20px; margin: 0; line-height: 1.5; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background: #0a0a0a; border-radius: .5rem; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); border-width: 1px; border-color: #262626">
          <!-- Header Section -->
          <div style="background: linear-gradient(330deg, rgba(211,60,200,.0) 0%, rgba(211,60,200,.3) 100%);padding: 20px; text-align: center;">
            <img src="https://eventstar.costionline.com/icons/Logo.svg" alt="EventStar Logo" style="max-width: 100px; height: auto; margin-bottom: 10px;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">You're Invited!</h1>
          </div>
          
          <!-- Content Section -->
          <div style="padding: 20px;background-color: #0a0a0a;">
            <p style="font-size: 16px; margin: 0 0 10px; color: white">Hi,</p>
            <p style="font-size: 16px; margin: 0 0 20px; color: white">
              You have been invited to an event hosted by <strong>EventStar</strong>! Please make sure to RSVP before the due date.
            </p>
            <div style="background: #0a0a0a; background: rgba(255,255,255,0.02); padding: 15px; border-left: 4px solid #4caf50; margin-bottom: 20px; border-radius: 0px;">
              <h2 style="margin: 0 0 10px; font-size: 20px; color: white;">${body.eventName}</h2>
              <p style="margin: 5px 0; font-size: 14px; color: white;"><strong>Date & Time:</strong> ${body.eventStart} - ${body.eventEnd}</p>
              <p style="margin: 5px 0; font-size: 14px; color: white;"><strong>Description:</strong> ${body.eventDescription}</p>
            </div>
            <a href="https://eventstar.costionline.com/calendar/view/${body.eventLink}" style="
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: white;
                background-color: #007BFF;
                text-decoration: none;
                border-radius: 5px;
            ">View Event</a>
            <p style="font-size: 14px; color: white; text-align: center;">
              Please RSVP or contact us if you have any questions.
            </p>
          </div>
          
          <!-- Footer Section -->
          <div style="background: linear-gradient(330deg, rgba(211,60,200,.0) 0%, rgba(211,60,200,.3) 100%); color: #ffffff; text-align: center; padding: 10px; font-size: 12px;">
            <p style="margin: 0;">Thank you for using Constantine EventStar!</p>
          </div>
        </div>
      </div>
    `,
    });



    return NextResponse.json("sent", { status: 200 });

}
