import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { emailOTP } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "../db/auth-schema";
import { getHtml } from "@/components/OTPEmail";
import type { SendEmailCommandInput } from "@aws-sdk/client-ses";
import { SES } from "@aws-sdk/client-ses";

const ses = new SES({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const auth = betterAuth({
  trustedOrigins: [
    "langturbo://",
    "https://app.langturbo.com",

    // Development mode - Expo's exp:// scheme with local IP ranges
    ...(process.env.NODE_ENV === "development"
      ? [
          "exp://*/*", // Trust all Expo development URLs
          "exp://10.0.0.*:*/*", // Trust 10.0.0.x IP range
          "exp://192.168.*.*:*/*", // Trust 192.168.x.x IP range
          "exp://172.*.*.*:*/*", // Trust 172.x.x.x IP range
          "exp://localhost:*/*", // Trust localhost
          "http://localhost:8081",
          "http://192.168.*.*:8081",
        ]
      : []),
  ],
  plugins: [
    expo(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // 10/10 score on mail-tester.com

          const emailHtml = await getHtml(otp);

          const params: SendEmailCommandInput = {
            Source: "contact@langturbo.com",
            ReplyToAddresses: ["contact@langturbo.com"],
            Destination: {
              ToAddresses: [email],
            },
            Message: {
              Body: {
                Html: {
                  Charset: "UTF-8",
                  Data: emailHtml,
                },
              },
              Subject: {
                Charset: "UTF-8",
                Data: "LangTurbo Verification Code",
              },
            },
          };

          await ses.sendEmail(params);
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
      },
    }),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
});
