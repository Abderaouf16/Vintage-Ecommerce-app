"use server";

import * as z from "zod";

import { createSafeActionClient } from "next-safe-action";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { db } from "..";
import { revalidatePath } from "next/cache";

const clientAction = createSafeActionClient();

export const deleteProduct = clientAction
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      await db.delete(products).where(eq(products.id, id)).returning();
      revalidatePath("/dashboard/products");
      return { success: "Product Deleted" };
    } catch (error) {
      console.error(error); // Log the error
      return { error: "field to delete product" };
    }
  });
