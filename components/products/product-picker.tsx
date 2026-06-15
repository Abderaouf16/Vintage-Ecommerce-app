"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductPick({
  id,
  color,
  productType,
  title,
  price,
  productID,
  image,
}: {
  id: number;
  color: string;
  productType: string;
  title: string;
  price: number;
  productID: number;
  image: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams()
  const selectedColor = searchParams.get('type')

  return (
    <div
    style={{ background: color }}
      className={cn(
        "w-8 h-8 rounded-full cursor-pointer hover: opacity-75 transition-all ease-in-out duration-300 ",
        selectedColor === productType ? ' opacity-100  ring-1 ring-muted-foreground' : " opacity-40"

      )}
      onClick={() =>
        router.push(
          `/products/${id}?id=${id}&productID=${productID}&price=${price}&title=${title}&type=${productType}&image=${image}`,
          { scroll: false }
        )
      }
    ></div>
  );
}
