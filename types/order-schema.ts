import * as z from "zod";

export const OrderSchema = z
  .object({
    productsBuyCost: z.number(),
    status: z.string().default("pending"),
    userID: z.string().optional(),

    firstName: z
      .string()
      .min(5, "Le prénom doit contenir au moins 5 caractères"),
    lastName: z.string().min(5, "Le nom doit contenir au moins 5 caractères"),
    phone: z.string().regex(/^\d{10,}$/, "Numéro de téléphone invalide"),
    wilaya: z.string().min(1),

    shippingMethod: z.enum(["home", "desk"]),

    shippingAddress: z.string().optional(),

    products: z.array(
      z.object({
        productID: z.number(),
        variantID: z.number(),
        quantity: z.number(),
      })
    ),
  })
  .refine(
    (data) => {
      if (data.shippingMethod === "home") {
        return data.shippingAddress && data.shippingAddress.length >= 10;
      }
      return true;
    },
    {
      message: "Veuillez saisir une adresse valide",
      path: ["shippingAddress"],
    }
  );

export type zOrderSchema = z.infer<typeof OrderSchema>;
