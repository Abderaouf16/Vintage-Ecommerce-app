"use server";

import getBasedURL from "@/lib/base-url";
import { Resend } from "resend";

const domain = getBasedURL();
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmaLink = `${domain}/auth/new-verification?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "PencilEcommerce - Confirmation Email",
    html: `<p>click to <a href='${confirmaLink}'> confirme your email </a> </p>`,
  });
  if (error) return console.log(error);
  if (data) return data;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "PencilEcommerce - Reset password confirmation",
    html: `<p>Click here <a href='${confirmLink}'>reset your password</a></p>`,
  });
  if (error) return console.log(error);
  if (data) return data;
};

export const sendTwoFactorTokenByEmail = async (
  email: string,
  token: string
) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "PencilEcommerce - Your 2 Factor Token",
    html: `<p>Your Confirmation Code: ${token}</p>`,
  });
  if (error) return console.log(error);
  if (data) return data;
};
