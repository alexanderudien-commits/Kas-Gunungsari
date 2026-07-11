import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from './db.js';
import * as schema from '../db/schema.js';

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    }
  }),
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      if (process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: "Kas Gunungsari <onboarding@resend.dev>",
            to: user.email,
            subject: "Verifikasi Email Anda",
            html: `<p>Klik <a href="${url}">di sini</a> untuk memverifikasi email Anda.</p>`,
          });
        } catch (e) {
          console.error("Gagal mengirim email verifikasi:", e);
        }
      } else {
        console.log(`[Email Mock] Verification URL for ${user.email}: ${url}`);
      }
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      if (process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: "Kas Gunungsari <onboarding@resend.dev>",
            to: user.email,
            subject: "Reset Password Anda",
            html: `<p>Klik <a href="${url}">di sini</a> untuk mereset password Anda.</p>`,
          });
        } catch (e) {
          console.error("Gagal mengirim email reset password:", e);
        }
      } else {
        console.log(`[Email Mock] Password Reset URL for ${user.email}: ${url}`);
      }
    },
  },
  trustedOrigins: process.env.CLIENT_URL ? [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"] : ["http://localhost:5173", "http://localhost:3000"],
});
