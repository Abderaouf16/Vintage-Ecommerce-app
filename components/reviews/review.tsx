"use client";
import { ReviewsWithUser } from "@/lib/infer-types";
import { motion } from "framer-motion";
import {
  Card,
} from "@/components/ui/card";
import Image from "next/image";
import { formatDistance, subDays } from "date-fns"
import Stars from "./starts";

export default function Review({ reviews }: { reviews: ReviewsWithUser[] }) {
  return (
    <motion.div>
      {reviews.length === 0 && ( 
        <p className="text-md font-medium py-2">No reviews yet</p>
      )}
      {reviews.map((review) => (
      
         <Card key={review.id} className="p-4 rounded-lg">
         <div className="flex gap-2 items-center">
           <Image
             className="rounded-full"
             width={32}
             height={32}
             alt={review.user.name!}
             src={review.user.image!}
           />
           <div>
             <p className="text-sm font-bold">{review.user.name}</p>
             <div className="flex items-center gap-2">
                <Stars rating={review.rating}/>
               <p className="text-xs text-bold text-muted-foreground">
                 {formatDistance(subDays(review.created!, 0), new Date(), {addSuffix: true})} 
               </p>
             </div>
           </div>
         </div>
         <p className="py-2 font-medium">{review.comment}</p>
       </Card>
      ))}
    </motion.div>
  );
}
