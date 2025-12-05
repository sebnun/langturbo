import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import { AccessToken, RoomAgentDispatch, RoomConfiguration } from "livekit-server-sdk";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { languageName, sentence } = await request.json();

  // If this room doesn't exist, it'll be automatically created when the first
  // participant joins
  const roomName = session.user.id + new Date();
  // Identifier to be used for participant.
  // It's available as LocalParticipant.identity with livekit-client SDK
  const participantName = session.user.id;

  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantName,
    // Token to expire after 10 minutes
    ttl: "10m",
  });

  at.addGrant({ roomJoin: true, room: roomName });
  at.roomConfig = new RoomConfiguration({
    agents: [
      new RoomAgentDispatch({
        metadata: JSON.stringify({ languageName, sentence }),
      }),
    ],
  });

  const token = await at.toJwt();

  console.log('token', session.user.id)

  return new Response(token);
}
