'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { products } from "../schema"


export async function  getProducts( id: number) {

    try {
        const product = await db.query.products.findFirst({
            where: eq(products.id, id),
        })

        if (!product) throw new Error ('Product not found')
            return {success : product}
    } catch (error) {
        console.error(error); // Log the error
        return {error: "Field to get product"}
    }
} 