import { db } from "@/server";
import { orders } from "@/server/schema";
import { type NextRequest, NextResponse } from "next/server";
import { createOrderSchema } from "@/types/order.schema"; // 🚨 Double check this path points to your Zod schema file!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate the incoming checkout data using your Zod guard
    const validatedData = createOrderSchema.parse(body);

    // 2. Insert the order directly into your Neon database
    const [newOrder] = await db
      .insert(orders)
      .values({
        userID: validatedData.userID || null, // Stores ID if logged in, null for guest checkouts
        total: validatedData.total,
        status: "pending", // Default starting status for local shipping
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        wilaya: validatedData.wilaya,
        shippingMethod: validatedData.shippingMethod,
        shippingCost: validatedData.shippingCost,
      })
      .returning();

    // 3. Return success back to your frontend form
    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      orderId: newOrder.id,
    });

  } catch (error: any) {
    console.error("Order creation failed:", error);

    // If the data sent from the form doesn't match your Zod rules
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}