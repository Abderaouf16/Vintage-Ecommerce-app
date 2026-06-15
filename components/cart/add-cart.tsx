"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {  useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/client-store";

export default function AddCart() {
  const [quantity, setQuantity] = useState(1);
  const params = useSearchParams()
  const id = Number(params.get("id"))
  const productID = Number(params.get("productID"))
  const title = params.get("title")
  const type = params.get("type")
  const price = Number(params.get("price"))
  const image = params.get("image")
  const {addToCart} = useCartStore()

/* 
  if (!id || !productID || !title || !type || !price || !image) {
    toast.error("Product not found")
    return redirect("/")
  }  */


  return (
    <>
      <div className="flex items-center justify-stretch gap-4 my-2">
        <Button
          variant={"secondary"}
          className=" text-primary"
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
        >
          <Minus size={18} />
        </Button>
        <Button variant={"secondary"} className="flex-1">
          Quantité : {quantity}
        </Button>
        <Button className="text-primary" variant={"secondary"}
        onClick={() => setQuantity(quantity + 1)}
        >
          <Plus size={18} />
        </Button>
      </div>
      {image && (
        <Button
        onClick={() => {
          toast.success(`Added ${ type} to your cart!`)
          addToCart({
              id: productID,
              variant: { variantID: id, quantity },
              name: title + " " + type,
              price,
              image
            })
        }}>Ajoutez au panier</Button>
      ) }
      
    </>
  );
}
