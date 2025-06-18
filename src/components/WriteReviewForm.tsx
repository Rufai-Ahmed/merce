"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Rating from "@/components/ui/Rating";
import { useCreateReviewMutation } from "@/apis/review.api";
import { toast } from "sonner";

const reviewFormSchema = z.object({
  reviewer: z.string().min(2, "Name must be at least 2 characters"),
  reviewer_email: z.string().email("Please enter a valid email address"),
  review: z.string().min(10, "Review must be at least 10 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface WriteReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

const WriteReviewForm: React.FC<WriteReviewFormProps> = ({
  productId,
  onSuccess,
}) => {
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const [rating, setRating] = useState(0);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      reviewer: "",
      reviewer_email: "",
      review: "",
      rating: 0,
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      const reviewData = {
        ...data,
        rating,
        product_id: productId,
      };

      await createReview(reviewData).unwrap();

      toast.success("Review submitted successfully!");
      form.reset();
      setRating(0);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reviewer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your name"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reviewer_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  disabled={isLoading}
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
              <FormLabel>Rating *</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Rating
                    onClick={(rate: number) => {
                      setRating(rate);
                      field.onChange(rate);
                    }}
                    initialValue={rating}
                    size={24}
                    allowFraction={false}
                    readonly={isLoading}
                    className="flex"
                  />
                  <span className="text-sm text-gray-600 ml-2">
                    {rating > 0 ? `${rating}/5` : "Select rating"}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="review"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts about this product..."
                  className="min-h-[120px] resize-none"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setRating(0);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || rating === 0}
            className="bg-black hover:bg-black/90"
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WriteReviewForm;
