"use server"; // don't forget to add this!

import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { getPasswordResetTokenByToken } from "./tokens";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { passwordResetTokens, users } from "../schema";
import bcrypt from "bcrypt"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"


const actionClient = createSafeActionClient();

export const newPassword = actionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {

    const pool = new Pool({ connectionString: process.env.POSTGRES_URL })
    //drizlle from neon serverless not http  
    const dbPool = drizzle(pool)

    if(!token) {
      return {error: "Missing token"}
    }

    //check if the token is a valid token
    
    const existingToken = await getPasswordResetTokenByToken(token)
    if(!existingToken){
      return {error: 'Token not found'}
    }
    
    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) {
      return { error: "Token has expired" }
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    })

    if (!existingUser) {
      return { error: "User not found" }
    }

    // hash the password 
    const hashedPassword = await bcrypt.hash(password, 10)

    // transaction is 2 actions same time that must be success
    //use webSoket 
    // http is fast for transactions
    // update the password in users table and delete the passwordResetToken at the same time

    await dbPool.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id))
      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id))
    })
    return { success: "Password updated" }

  });
