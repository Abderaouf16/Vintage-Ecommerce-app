/* import Algolia from "@/components/products/algolia";
 */
import ProductTags from "@/components/products/product-tags";
import Products from "@/components/products/products";
import { db } from "@/server";
import React from "react";

export const revalidate = 3600 // next 15 do not except math equation

export default async function Home() {


  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true
    },
    orderBy: (productVariants, {desc}) => [desc(productVariants.id)]
  })

  return (
   <main>
    {/* <Algolia/> */}
    <ProductTags/>
    <Products variants={data} />
   </main>
  );
}

