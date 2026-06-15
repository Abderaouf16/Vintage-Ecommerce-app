"use server"

import { paymentIntentSchema } from "@/types/payment-intent-schema"
import { createSafeActionClient } from "next-safe-action"
import Stripe from "stripe"
import { auth } from "../auth"

const stripe = new Stripe(process.env.STRIPE_SECRET!)

const actionClient = createSafeActionClient();

export const createPaymentIntent = actionClient
  .schema(paymentIntentSchema)
  .action(async ({ parsedInput: { amount, cart, currency } }) => {
    try {
        
        console.log('it worked here')
        const user = await auth()
        if (!user) return { error: "Please login to continue" }
        if (!amount) return { error: "No Product to checkout" }
    
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          automatic_payment_methods: {
            enabled: true,
          },
    
          metadata: {
            cart: JSON.stringify(cart.toString()),
          },
        })
        
        return {
          success: {
            paymentIntentID: paymentIntent.id,
            clientSecretID: paymentIntent.client_secret,
            user: user.user.email,
          },
          
        }
    } catch (error) {
        console.log(error)
    }
   
  });

/* 
How It Fits in the Flow
Here’s a simplified payment flow:

Frontend:

The user selects items, adds them to the cart, and clicks "Pay Now."
The client-side code calls createPaymentIntent with the cart and total amount.
Server:

The createPaymentIntent function runs:
Validates the user and cart.
Creates a Payment Intent in Stripe.
Returns the client_secret to the frontend.
Frontend:

The client uses the client_secret to confirm the payment using Stripe’s React SDK.
Stripe:

Processes the payment (e.g., deducts the amount from the user's card).
Sends a webhook event for updates (e.g., "payment succeeded").
Server:

The webhook handler processes the event and updates the database (e.g., marks the order as paid).*/