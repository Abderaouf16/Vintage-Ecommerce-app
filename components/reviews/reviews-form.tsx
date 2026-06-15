"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { ReviewsSchema, zReviewsSchema } from "@/types/reviews-schema";
import { Textarea } from "../ui/textarea";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { addReview } from "@/server/actions/add-review";

export default function ReviewsFrom() {
  const params = useSearchParams();
  const productID = Number(params.get("productID"));

  const form = useForm<zReviewsSchema>({
    resolver: zodResolver(ReviewsSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      productID,
    },
  });

  const { execute, status } = useAction(addReview, {
    onSuccess: (data) => {
      toast.dismiss(); // Dismiss the loading message

      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success(data.data.success);
        form.reset()
      }
    },
  });

  function onSubmit(values: zReviewsSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    execute({
      comment: values.comment,
      rating: values.rating,
      productID,
    });
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button variant={"secondary"} className="font-medium w-full my-4">
            Leave a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your review</FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-sm"
                      placeholder="How would you describe this product"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your Rating</FormLabel>
                  <FormControl>
                    <Input type="hidden" placeholder="Star Rating" {...field} />
                  </FormControl>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => {
                      return (
                        <motion.div key={value} className="">
                          <Star
                            key={value}
                            onClick={() => {
                              form.setValue("rating", value);
                            }}
                            className={cn(
                              " text-primary bg-transparent transition-all duration-300 ease-in-out cursor-pointer",
                              form.getValues("rating") >= value
                                ? "fill-primary"
                                : " fill-muted"
                            )}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={status === "executing"}
              className="w-full"
            >
              {status === "executing" ? "Adding Review" : "Add Review"}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
