"use client";

import { getReviewAverage } from "@/lib/review-average";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { ReviewsWithUser } from "@/lib/infer-types";
import { useMemo } from "react";
import { Progress } from "../ui/progress";

export default function ReviewChart({
  reviews,
}: {
  reviews: ReviewsWithUser[];
}) {
  const totalRating = getReviewAverage(reviews.map((r) => r.rating));
  const getRatingByStarts = useMemo(() => {
    const ratingValues = Array.from({ length: 5 }, () => 0);
    const totalReviews = reviews.length;
    reviews.forEach((review) => {
      const startIndex = review.rating - 1;
      if (startIndex >= 0 && startIndex < 5) {
        ratingValues[startIndex]++;
      }
    });

    return ratingValues.map((rating) => (rating / totalReviews) * 100);
  }, [reviews]);
  return (
    <Card className=" flex flex-col rounded-lg gap-6 p-8 my-4">
      <div className=" flex flex-col gap-2 ">
        <CardTitle className=" font-bold text-xl"> Product Rating: </CardTitle>
        <CardDescription className="text-lg font-medium">{totalRating.toFixed(1)} stars </CardDescription>
      </div>
      {getRatingByStarts.map((rating, index) => (
        <div className="flex gap-2 justify-between items-center" key={index}>
          <p className="text-xs font-medium flex gap-1">
            {index + 1} <span>stars</span>{" "}
          </p>
          <Progress value={rating} />
        </div>
      ))}
    </Card>
  );
}
