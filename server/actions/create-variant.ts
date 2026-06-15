"use server"; // don't forget to add this!

import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { VariantSchema } from "@/types/variant-schema";
import { products, productVariants, variantImages, variantTags } from "../schema";
import { revalidatePath } from "next/cache";
import algoliasearch from 'algoliasearch';

const actionClient = createSafeActionClient();

/*  const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!, 
) 
const indexName = "products";
const algoliaIndex = client.initIndex(indexName); */

export const createVariant = actionClient
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        productType,
        id,
        variantImages: newImgs,
        tags,
        color,
        editMode,
        productID,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({ color, productType, updated: new Date() })
            .where(eq(productVariants.id, id))
            .returning();
          if (!editVariant.length) {
            return { error: "Variant not found for editing." };
          }
      
          await db.delete(variantTags).where(eq(variantTags.variantID, id));
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: id,
            }))
          );
      
          await db.delete(variantImages).where(eq(variantImages.variantID, id));
          await db.insert(variantImages).values(
            newImgs.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: id,
              order: idx,
            }))
          );
        /*   algoliaIndex.partialUpdateObject({
            objectID: editVariant[0].id.toString(),
            id: editVariant[0].productID,
            productType: editVariant[0].productType,
            variantImages: newImgs[0].url,
          })
       */
          revalidatePath("/dashboard/products");
          return { success: `Product Variant Updated` };
      }
      

        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productID,
            })
            .returning();

             await db.query.products.findFirst({
              where: eq(products.id, productID),
            })

          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: newVariant[0].id,
            }))
          );
          await db.insert(variantImages).values(
            newImgs.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: newVariant[0].id,
              order: idx,
            }))
          );
         /*  if (product) {
            algoliaIndex.saveObject({
              objectID: newVariant[0].id.toString(),
              id: newVariant[0].productID,
              title: product.title,
              price: product.price,
              productType: newVariant[0].productType,
              variantImages: newImgs[0].url,
            })
          } */
          revalidatePath("/dashboard/products");
          return { success: "Product Variant Created" };
        }
      } catch (error) {
        console.error(error); // Log the error
        return { error: "Failed to create variant" };
      }
    }
  );
