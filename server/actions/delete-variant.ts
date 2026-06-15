"use server";

import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
 import algoliasearch from "algoliasearch"

const actionClient = createSafeActionClient();
/* const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
)  */

/* const algoliaIndex = client.initIndex("products")
 */
export const deleteVariant = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
       await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();
      revalidatePath("/dashboard/products");
/*       algoliaIndex.deleteObject(deletedVariant[0].id.toString())
 */      return { success: "Product Variant Deleted" };
    } catch (error) {
      console.error(error); // Log the error
      return { error: "Field deleting variant" };
    }
  });
