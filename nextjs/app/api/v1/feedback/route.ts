import { type NextRequest } from "next/server";
import type { SendEmailCommandInput } from "@aws-sdk/client-ses";
import { SES } from "@aws-sdk/client-ses";

const ses = new SES({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  const { feedback, context } = await request.json();

  const params: SendEmailCommandInput = {
    Source: "contact@langturbo.com",
    Destination: {
      ToAddresses: ["contact@langturbo.com"],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: context + "\n\n" + feedback,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "LangTurbo Feedback",
      },
    },
  };

  await ses.sendEmail(params);

  return new Response("ok");
}
