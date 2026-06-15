"use server";

import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { orderProduct, orders } from "../schema";
import { OrderSchema } from "@/types/order-schema";
import { WILAYA_SHIPPING_RATES } from "@/lib/shipping-willaya";
const actionClient = createSafeActionClient();

export const createOrder = actionClient
  .schema(OrderSchema)
  .action(
    async ({
      parsedInput: {
        status,
        productsBuyCost,
        firstName,
        lastName,
        products,
        phone,
        wilaya,
        shippingMethod,
        shippingAddress,
      },
    }) => {
      const user = await auth();
      /*  if (!user) return { error: "User not found" }; */

      try {
        const targetWilayaData = WILAYA_SHIPPING_RATES[wilaya];
        if (!targetWilayaData) {
          return { error: "Wilaya invalide." };
        }
        console.log(targetWilayaData);
        const displayedWilayaInDB = `${wilaya} ${targetWilayaData.name}`;

        const serverCalculatedShippingCost =
          targetWilayaData[shippingMethod as "home" | "desk"];

        // Final secure total calculation combined on the backend server side
        const secureFinalTotal =
          Number(productsBuyCost) + Number(serverCalculatedShippingCost);

        const insertedOrders = await db
          .insert(orders)
          .values({
            status: status || "pending",
            total: secureFinalTotal, // Server side total recorded
            productsBuyCost: productsBuyCost ,
            userID: user?.user?.id || null,
            phone,
            wilaya: displayedWilayaInDB,
            shippingCost: serverCalculatedShippingCost,
            shippingMethod,
            shippingAddress,
            lastName,
            firstName,
          })
          .returning();

        const newOrder = insertedOrders[0];
        if (!newOrder) {
          return { error: "Échec de l'enregistrement de la commande." };
        }
        await Promise.all(
          products.map(async ({ productID, quantity, variantID }) => {
            return db.insert(orderProduct).values({
              quantity,
              orderID: newOrder.id,
              productID: productID,
              productVariantID: variantID,
            });
          })
        );
        return { success: "Votre commande a été traitée avec succès !" };
      } catch (error) {
        console.error("Database Transaction Error:", error);
        return { error: "Une erreur interne est survenue sur nos serveurs." };
      }

      /* const order = await db
        .insert(orders)
        .values({
          status,
          total,
          userID: user?.user.id,
          phone,
          wilaya,
          shippingCost,
          shippingMethod,
          lastName,
          firstName,
        })
        .returning();
      products.map(async ({ productID, quantity, variantID }) => {
        await db.insert(orderProduct).values({
          quantity,
          orderID: order[0].id,
          productID: productID,
          productVariantID: variantID,
        });
      });
      return { success: "Order has been added" }; */
    }
  );
