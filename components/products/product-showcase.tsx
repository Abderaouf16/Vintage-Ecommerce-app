"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { VariantsWithImagesTags } from "@/lib/infer-types";
import { type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ProductShowCase({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThumbnail] = useState([0]);

  const searchParams = useSearchParams();
  const selectedVariant = searchParams.get("type" /* || variants[0].productType */);

  function updatePreview (index: number) {
    api?.scrollTo(index)
  }
  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("slidesInView", (e) => {
      setActiveThumbnail(e.slidesInView());
    });
  }, [api]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        {variants.map(
          (variant) =>
            selectedVariant === variant.productType &&
            variant.variantImages.map((img) => {
              return (
                <CarouselItem key={img.url}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-2">
                        {img.url ? (
                          <Image
                            priority
                            className=" rounded-md"
                            src={img.url}
                            alt={img.name}
                            height={720}
                            width={1280}
                          />
                        ) : null}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })
        )}
      </CarouselContent>
      <div className="py-2 flex items-center gap-4">
        {variants.map(
          (variant) =>
            selectedVariant === variant.productType &&
            variant.variantImages.map((img, index) => {
              return (
                <div key={img.url}
                onClick={() => updatePreview(index)}>
                  {img.url ? (
                    <Image
                      priority
                      className= {cn('rounded-md shadow-md aspect-square transition-all duration-300 ease-in-out cursor-pointer',
                         index === activeThumbnail[0] ? " opacity-100" : "opacity-40")}
                      src={img.url}
                      alt={img.name}
                      height={48}
                      width={72}
                    />
                  ) : null}
                </div>
              );
            })
        )}
      </div>
    </Carousel>
  );
}
