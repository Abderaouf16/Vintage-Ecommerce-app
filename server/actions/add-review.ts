"use server"; // don't forget to add this!

import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { ReviewsSchema } from "@/types/reviews-schema";
import { auth } from "../auth";
import { reviews } from "../schema";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const addReview = actionClient
  .schema(ReviewsSchema)
  .action(async ({ parsedInput: { comment, rating, productID } }) => {
    try {
      const session = await auth();
      if (!session) return { error: "Please sign in" };

      const reviewExists = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productID, productID),
          eq(reviews.userID, session.user.id)
        ),
      });

      if(reviewExists) return {error: "You have already reviewed this product"}

       await db.insert(reviews)
      .values({
        comment,
        rating,
        productID,
        userID: session.user.id
      }).returning()

      revalidatePath(`/products/${productID}`)
      return {success: 'review added'}
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
