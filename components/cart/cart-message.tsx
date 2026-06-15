"use client";

import { useCartStore } from "@/lib/client-store";
import { motion } from "framer-motion";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";
import { ArrowLeft } from "lucide-react";

export default function CartMessage() {
  const { checkoutProgress, setCheckoutProgress } = useCartStore();

  return (
    <motion.div className=" text-center" initial={{opacity:0, x:10}} animate={{opacity:1, x:0}}>
      <DrawerTitle>
        {checkoutProgress === "cart-page" ? "Votre panier" : null}
        {checkoutProgress === "payment-page" ? "Information du client" : null}
        {checkoutProgress === "confirmation-page" ? "Commande Confirmé" : null}
      </DrawerTitle>
      <DrawerDescription className="py-1">
        {checkoutProgress === "cart-page" ? "  Voir et modifer votre panier." : null}
        {checkoutProgress === "payment-page" ? (
          <span
            onClick={() => setCheckoutProgress("cart-page")}
            className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary"
          >
            <ArrowLeft size={14} /> Retour au panier
          </span>
        ) : null}
        {checkoutProgress === "confirmation-page"
          ? "You will recieve an email with your receipt!"
          : null}
      </DrawerDescription>
    </motion.div>
  );
}
