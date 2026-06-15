"use client";

import { VariantsWithImagesTags } from "@/lib/infer-types";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ProductType({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) {
  const searchParams = useSearchParams();
  const selectedtype = searchParams.get("type") || variants[0].productType;

  return variants.map((variant) => {
    if (variant.productType === selectedtype) {
      return (
        <motion.div
          key={variant.id}
          //Positioned 6 pixels below its normal position.
          initial={{ opacity: 0, y: 6 }}
          //Moves to its normal position.
          animate={{ y: 0, opacity: 1 }}
        >
          {selectedtype}
        </motion.div>
      );
    }
  });
}
