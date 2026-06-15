"use server"; // don't forget to add this!

import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { sendPasswordResetEmail } from "./email";
import {  generatePasswordResetToken } from "./tokens";
import { ResetSchema } from "@/types/reset-schema";

const actionClient = createSafeActionClient();

export const ResetPassword = actionClient
  .schema(ResetSchema)
  .action(async ({ parsedInput: { email } }) => {

    const existingUser = db.query.users.findFirst({
        where: eq(users.email, email)
    })
    if(!existingUser) {
        return {error: "User not found"}
    }

    const passwordResetToken = await generatePasswordResetToken(email)

    if(!passwordResetToken) {
        return {error: "Token not generated"}
    }
    
    await sendPasswordResetEmail(
        passwordResetToken[0].email,
        passwordResetToken[0].token
    )

    return {success: "Reset Email sent"}
  });
