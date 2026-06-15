'use client'

import Link from "next/link"
import { Button } from "../ui/button"
import { useCartStore } from "@/lib/client-store"
import { motion } from "framer-motion"
import Lottie from "lottie-react"
import orderConfirmedIcon from '@/public/order-confirme.json'


export default function OrderConfirmed() {
  const {setCheckoutProgress, setCartOpen} = useCartStore()
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
       initial={{opacity:0, scale:0}}
      animate={{opacity:1, scale:1}}
      transition={{delay:0.35}}
      >

        <Lottie className="h-56 my-4" animationData={orderConfirmedIcon} />
      </motion.div>
      <h2 className="text-2xl font-medium">Merci de votre confiance !</h2>
      <Link href={"/"}>
        <Button
          variant={"secondary"}
          onClick={() => {
            setCheckoutProgress("cart-page")
            setCartOpen(false)
          }}
        >
          Retourner à la boutique
        </Button>
      </Link>
      </div>
  )
}
