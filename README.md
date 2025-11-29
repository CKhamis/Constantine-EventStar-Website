# Constantine EventStar
EventStar is an online service developed by Constantine Khamis that will organize event information, automate invitation reminders, and much more.

## Features
While EventStar is still in active construction, here is a short list of features you can expect now or in the future:

### Create Events
EventStar makes planning and organizing events easier. Simply use the event editor to create, modify, and invite guests. The event editor has fields for the event name, location, +1s allowed, RSVP due date, start time, end time, invite visibility, type, custom backgrounds, and description with markdown support for easy formatting.

### Invite Guests
Inviting friends, family, and other guests is simple with EventStar. Depending on your event’s visibility settings, you can share invitation links that show event details only to the people you choose—or make the information accessible to anyone. EventStar also supports guests without accounts through Write-In RSVPs. These write-in guests appear in the invite list alongside registered attendees and, if the organizer permits, can even add their own +1s.

### Organize RSVPs
Event organizers can add, remove, and modify guest RSVP information, even if they don't change it themselves. This allows for better organization and a simpler event hosting process.

### Event Feed
EventStar contains a unified user feed that has all of their upcoming and past invitations from other EventStar users. Users are able to follow each other and invite them to their own events. You can even quick reply to these events straight from the feed!


[//]: # (### Track and Earn Points)

[//]: # (EventStar offers its own reward service just for using the platform. Points can be redeemed for various rewards, such as a high five, a goodnight text, or even the chance to gamble and double your points!)

[//]: # ()
[//]: # (### Your Very own Membership Card)

[//]: # (Certain EventStar members will receive a custom-made NFC-compatible membership card. This card can be used to validate attendance at events. Use this card to check in instead of entering your 4-digit PIN in the EventStar terminal.)

[//]: # ()
[//]: # (### Rate Spots with Friends)

[//]: # (The spots feature allows you and others to rate and add locations for selection during regular hangouts. You can rate places on a 0-100 scale, apply a veto restriction, and see how other members have rated a particular location.)

# Development Setup
1. Run `NPM i`
2. Run `prisma generate`
3. Add OAuth secrets to env
4. Run `npx shadcn@latest add`, select all components with `a`, enter `y` to proceed, `enter` to choose Neutral
5. Run `npm run dev`