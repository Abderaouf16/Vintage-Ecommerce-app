"use client";

import { useCartStore } from "@/lib/client-store";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { createOrder } from "@/server/actions/create-order";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderSchema, zOrderSchema } from "@/types/order-schema";
import { WILAYA_SHIPPING_RATES } from "@/lib/shipping-willaya";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/ui/field";

import { Input } from "../ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaymentForm({ orderPrice }: { orderPrice: number }) {
  const { setCheckoutProgress, clearCart, cart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<zOrderSchema>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      wilaya: "",
      shippingMethod: undefined,
      shippingAddress: "",
      productsBuyCost: orderPrice,
      products: [],
    },
    mode: "onChange",
  });

  const selectedWilaya = form.watch("wilaya");
  const selectedShipingMethod = form.watch("shippingMethod");

  const wilayaData = WILAYA_SHIPPING_RATES[selectedWilaya];

  
  const { execute, status } = useAction(createOrder, {
    onSuccess: (data) => {
      setIsLoading(false);

      if (data.data?.error) {
        toast.error(data.data.error, { id: "order-toast" });
      }

      if (data.data?.success) {
        toast.success(data.data.success, { id: "order-toast" });
        setCheckoutProgress("confirmation-page");
        clearCart();
      }
    },

    onExecute: () => {
      setIsLoading(true);
      toast.dismiss(); // Dismiss the loading message
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
      total: orderPrice,
      products: formattedProducts,
      status: "pending",
    });
  }

  useEffect(() => {
    if (selectedShipingMethod === "desk") {
      form.setValue("shippingAddress", "");
    }
  }, [selectedShipingMethod, form]);

  /* // 3. Sync calculated shipping prices dynamically
    useEffect(() => {
      if (selectedWilaya && selectedShipingMethod) {
        const rateObj = WILAYA_SHIPPING_RATES[selectedWilaya];
        const cost = rateObj ? rateObj[selectedShipingMethod as "home" | "desk"] : 0;
  
        form.setValue("shippingCost", cost, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }, [selectedWilaya, selectedShipingMethod, form]); */

  const { isValid, isDirty } = form.formState;
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Ajoutez vos information de livraison:</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénon</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro Telephone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="000-000-000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wilaya"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Willaya de livraison</FormLabel>
                    <FormControl>
                      <Field className="w-full max-w-48">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selectionnez Willaya" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Object.entries(WILAYA_SHIPPING_RATES)
                                .sort(([a], [b]) => Number(a) - Number(b))
                                .map(([code, wilaya]) => (
                                  <SelectItem key={code} value={code}>
                                    {code} - {wilaya.name}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shippingMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de livraison</FormLabel>
                    <FormControl>
                      <Field className="w-full max-w-48">
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          disabled={!selectedWilaya}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un mode de livraison" />
                          </SelectTrigger>
                          <SelectContent>
                            {wilayaData && (
                              <>
                                <SelectItem value="home">
                                  à domicile — {wilayaData.home} DA
                                </SelectItem>

                                <SelectItem value="desk">
                                  Stop Desk — {wilayaData.desk} DA
                                </SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </Field>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedWilaya && selectedShipingMethod === "home" ? (
                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse de Livraison</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ajoutez votre Adresse de livraison"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                ""
              )}

              <Button
                className="w-full"
                type="submit"
                disabled={status === "executing" || !isValid || !isDirty}
              >
                Commendez Maintenant
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
