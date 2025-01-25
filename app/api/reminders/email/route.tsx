import {NextRequest, NextResponse} from "next/server";
import { Resend } from 'resend';
import {emailRequest} from "@/components/Types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    const body:emailRequest = await request.json();

    await resend.emails.send({
        from: 'EventStar <onboarding@resend.dev>',
        to: body.to,
        scheduledAt: body.scheduledAt,
        subject: body.subject,
        // react: <NewEvent eventStart={body.eventStart} eventEnd={body.eventEnd} eventName={body.eventName} eventDescription={body.eventDescription} />
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; margin: 0; line-height: 1.5; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <!-- Header Section -->
          <div style="background-color: #4caf50; padding: 20px; text-align: center;">
            <img src="https://costionline.com/icons/Logo.svg" alt="EventStar Logo" style="max-width: 100px; height: auto; margin-bottom: 10px;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">You're Invited!</h1>
          </div>
          
          <!-- Content Section -->
          <div style="padding: 20px;">
            <p style="font-size: 16px; margin: 0 0 10px;">Hello,</p>
            <p style="font-size: 16px; margin: 0 0 20px;">
              You have been invited to an event hosted by <strong>EventStar</strong>!
            </p>
            <div style="background-color: #f3f3f3; padding: 15px; border-left: 4px solid #4caf50; margin-bottom: 20px; border-radius: 5px;">
              <h2 style="margin: 0 0 10px; font-size: 20px; color: #333;">${body.eventName}</h2>
              <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>Date & Time:</strong> ${body.eventStart} - ${body.eventEnd}</p>
              <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>Description:</strong> ${body.eventDescription}</p>
            </div>
            <p style="font-size: 14px; color: #555; text-align: center;">
              Please RSVP or contact us if you have any questions.
            </p>
          </div>
          
          <!-- Footer Section -->
          <div style="background-color: #4caf50; color: #ffffff; text-align: center; padding: 10px; font-size: 12px;">
            <p style="margin: 0;">Thank you for using EventStar!</p>
            <p style="margin: 0;">Need help? Contact us at <a href="mailto:support@eventstar.com" style="color: #ffffff; text-decoration: underline;">support@eventstar.com</a></p>
          </div>
        </div>
      </div>
    `,
    });



    return NextResponse.json("sent", { status: 200 });

}
