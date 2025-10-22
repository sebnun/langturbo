import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; 
import { emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", 
    }),
    plugins: [
        emailOTP({ 
            async sendVerificationOTP({ email, otp, type }) { 
                if (type === "sign-in") { 
                    // Send the OTP for sign in
                } else if (type === "email-verification") { 
                    // Send the OTP for email verification
                } else { 
                    // Send the OTP for password reset
                } 
            }, 
        }) 
    , nextCookies()],
});