"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/client-store";
import CartItem from "./cart-items";
import CartMessage from "./cart-message";
import Payment from "./payment";
import OrderConfirmed from "./order-confirmed";
import CartProgress from "./cart-progress";
import React from "react"; // Added for ErrorBoundary

// 🛠️ TEMPORARY DEBUGGER COMPONENT
class InternalFormDebugger extends React.Component<{ children: React.ReactNode }, { hasError: boolean; errorInfo: string }> {
  state = { hasError: false, errorInfo: "" };
  componentDidCatch(error: Error) {
    this.setState({ hasError: true, errorInfo: error.message });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-destructive/10 text-destructive text-xs border rounded-lg font-mono">
          <p className="font-bold">💥 Found the broken form component!</p>
          <p className="mt-1">{this.state.errorInfo}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function CartDrawer() {
  const { cart, checkoutProgress, setCartOpen, cartOpen } = useCartStore();

  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>
      <DrawerTrigger asChild>
        <div className="cursor-pointer relative md:px-2 pr-1">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center text-white font-bold rounded-full text-xs bg-primary dark:bg-primary -top-1.5 -right-0 w-4 h-4"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingCart />
        </div>
      </DrawerTrigger>
      <DrawerContent className="fixed bottom-0 left-0 max-h-[80vh] min-h-[50vh]">
        <DrawerHeader>
          <CartMessage />
        </DrawerHeader>
        <CartProgress />
        
        {/* 🔍 THE DEBUGGER IS WRAPPING THIS CONTAINER NOW */}
        <div className="overflow-auto p-4">
          <InternalFormDebugger>
            {checkoutProgress === "cart-page" && <CartItem />}
            {checkoutProgress === "payment-page" && <Payment />}
            {checkoutProgress === "confirmation-page" && <OrderConfirmed />}
          </InternalFormDebugger>
        </div>

      </DrawerContent>
    </Drawer>
  );
}