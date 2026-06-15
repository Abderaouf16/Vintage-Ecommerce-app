'use client'

import { useCartStore } from "@/lib/client-store"
import { motion } from "framer-motion"
import PaymentForm from "./payment-form"


export default function Payment() {
    const {cart} = useCartStore()
    const totalPrice = cart.reduce((acc, item) => {
       return acc + item.price * item.variant.quantity
    },0)
    const totalPriceCents = Math.round(totalPrice);


    return(
        <motion.div className="max-w-2xl mx-auto">
            <div className="">
                <PaymentForm orderPrice={totalPriceCents}/>
            </div>
        </motion.div>
    )
}