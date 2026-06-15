"use server";

import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { RegisterSchema } from "@/types/register-schema";
import bcrypt from "bcrypt";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";

const actionClient = createSafeActionClient();

export const emailRgister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if the email entred is verified "correct email"
    // grab the user by email that matches the email entered in the form
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "Email confirmation resent" };
      }
      return { error: "Email already in use" };
    }

    // loginc for when the user is not registred

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword
    });
    const verificationToken = await generateEmailVerificationToken(email);
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );

    return { success: "Confirmation email sent!" };
    
  });
