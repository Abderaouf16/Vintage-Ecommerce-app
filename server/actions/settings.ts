'use server';

import { SettingsSchema } from "@/types/settings-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from 'bcrypt'
import { revalidatePath } from "next/cache";


 const actionClient = createSafeActionClient()


 export const settings = actionClient
   .schema(SettingsSchema)
   .action(async ({ parsedInput: { email, password, name, newPassword, image, isTwoFactorEnabled } }) => {
    // check if the use is here signin at first
    const user = await auth()
    if(!user){
        return  {error: 'user not found'}
    }
    // check if it's in the database
    const dbUser = await db.query.users.findFirst({
        where: eq(users.id , user.user.id )
    })
    if(!dbUser){
        return {error: 'user not found'}
    }

    if(user.user.isOAuth) {
        email = undefined
        password = undefined
        newPassword = undefined
        isTwoFactorEnabled = undefined
    }

    if(password && newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(password, dbUser.password)
        if(!passwordMatch){
            return {error: 'password not match'}
        }
        const samePassword  = await bcrypt.compare(newPassword, dbUser.password)
        if(samePassword){
            return {error: 'new password must be different from the old one'}
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        password = hashedPassword
        newPassword = undefined
    }

    await db.update(users).set({
        twoFactorEnabled: isTwoFactorEnabled,
        name: name,
        email: email,
        password: password,
        image: image
    }).where(eq(users.id ,dbUser.id))
    
    revalidatePath('/dashboard/settings')

    return {success: "Settings updated"}
})