"use client";

import { useCartStore } from "@/lib/client-store";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { createOrder } from "@/server/actions/create-order";
import { toast } from "sonner";
import { Form, useForm } from "react-hook-form";
import { WILAYA_SHIPPING_RATES } from "@/lib/shipping-willaya";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderSchema, zOrderSchema } from "@/types/order-schema";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaymentForm({ orderPrice }: { orderPrice: number }) {
  const { setCheckoutProgress, clearCart, cart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  // 1. CRITICAL FIX: Initialize useForm FIRST before any other hooks or calls
  const form = useForm<zOrderSchema>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      wilaya: "",
      shippingMethod: "desk",
      shippingCost: 0,
    },
    mode: "onChange",
  });

  // 2. Safely setup form watchers AFTER initializing the form instance
  const watchedWilaya = form.watch("wilaya");
  const watchedMethod = form.watch("shippingMethod");

  // 3. Sync calculated shipping prices dynamically
  useEffect(() => {
    if (watchedWilaya && watchedMethod) {
      const rateObj = WILAYA_SHIPPING_RATES[watchedWilaya];
      const cost = rateObj ? rateObj[watchedMethod as "home" | "desk"] : 0;

      form.setValue("shippingCost", cost, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [watchedWilaya, watchedMethod, form]);

  // 4. Calculate variables for your live invoice totals
  const currentShippingCost = form.watch("shippingCost") || 0;
  
  // Note: Since orderPrice is coming in as Cents from your Payment wrapper, 
  // divide by 100 to display standard DA currency context visually
  const subtotalDA = orderPrice / 100; 
  const grandTotalDA = subtotalDA + currentShippingCost;

  // 5. Connect next-safe-action execution hook
  const { execute, status } = useAction(createOrder, {
    onSuccess: (data) => {
      setIsLoading(false);
      if (data.data?.error) {
        toast.error(data.data.error , );
      }
      if (data.data?.success) {
        toast.success(data.data.success);
        setCheckoutProgress("confirmation-page");
        clearCart();
      }
    },
    onExecute: () => {
      setIsLoading(true);
      toast.loading("Traitement de votre commande...", { id: "order-toast" });
    },
  });

  function onSubmit(values: zOrderSchema) {
    const formattedProducts = cart.map((item) => ({
      productID: item.id,
      variantID: item.variant.variantID, 
      quantity: item.variant.quantity,
    }));

    execute({
      ...values,
      total: subtotalDA, // Passes clean product subtotal down to backend
      products: formattedProducts,
      status: "pending",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
        
        {/* NOM FIELD */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PRÉNOM FIELD */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input placeholder="Prénom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TELEPHONE FIELD */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro Téléphone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="0XXXXXXXXX" type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* WILAYA SELECT FIELD */}
        {/* 1. FIXED WILAYA FIELD */}
<FormField
  control={form.control}
  name="wilaya"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Wilaya de livraison</FormLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        <FormControl> {/* ✅ ADDED WRAPPER */}
          <SelectTrigger className="w-full h-11 bg-popover">
            <SelectValue placeholder="Sélectionnez votre Wilaya" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {/* ... items ... */}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

{/* 2. FIXED SHIPPING METHOD FIELD */}
<FormField
  control={form.control}
  name="shippingMethod"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Mode de livraison</FormLabel>
      <Select value={field.value}
      onValueChange={(value) => {
        field.onChange(value);
    
        const rate = WILAYA_SHIPPING_RATES[watchedWilaya];
    
        if (rate) {
          form.setValue("shippingCost", rate[value as "home" | "desk"]);
        }
      }}>
        <FormControl> {/* ✅ ADDED WRAPPER */}
          <SelectTrigger className="w-full h-11 bg-popover">
            <SelectValue placeholder="Sélectionnez le mode de livraison" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {/* ... items ... */}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
        {/* LIVE INVOICE RECIEPT */}
        {watchedWilaya && (
          <div className="p-4 bg-muted/50 rounded-xl space-y-2 text-sm border">
            <div className="flex justify-between text-muted-foreground">
              <span>Sous-total:</span>
              <span>{subtotalDA} DA</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Frais de livraison:</span>
              <span>{currentShippingCost} DA</span>
            </div>
            <hr className="border-dashed" />
            <div className="flex justify-between font-bold text-base text-foreground">
              <span>Total final à payer:</span>
              <span className="text-primary">{grandTotalDA} DA</span>
            </div>
          </div>
        )}

        <Button
          className="w-full h-11 font-semibold animate-fade-in"
          type="submit"
          disabled={status === "executing" || !form.formState.isValid}
        >
          {isLoading ? "Traitement..." : "Commandez maintenant"}
        </Button>
      </form>
    </Form>
  );
}