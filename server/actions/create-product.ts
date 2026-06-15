"use server"; // don't forget to add this!

import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { ProductSchema } from "@/types/product-schema";
import { products } from "../schema";

const actionClient = createSafeActionClient();

export const createProduct = actionClient
  .schema(ProductSchema)
  .action(async ({ parsedInput: { description, title, price, id } }) => {

    try {
        if(id) {
            const currentProduct = await db.query.products.findFirst({
                where: eq(products.id, id)
            }) 
            if(!currentProduct) return {error: "Product not found"}

            await db.update(products).set({
                title,
                description,
                price
            }).where(eq(products.id, id))
            return {success: "Product Updated"}
        }

        if(!id) {
            await db.insert(products).values({
                title,
                description,
                price
            }).returning()
            return {success: "Product Created"}
        }

    } catch (error) {
        return {error: JSON.stringify(error)}
    }
  });
