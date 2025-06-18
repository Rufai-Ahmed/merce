import ReviewCard from "@/components/common/ReviewCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Review } from "@/types/review.types";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import WriteReviewForm from "@/components/WriteReviewForm";

interface ReviewsContentProps {
  reviewsData: Review[];
  isLoading: boolean;
  productId: string;
}

const ReviewsContent = ({
  reviewsData,
  isLoading,
  productId,
}: ReviewsContentProps) => {
  if (isLoading) {
    return (
      <section>
        <Skeleton className="h-8 w-1/4 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-9">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between flex-col sm:flex-row mb-5 sm:mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <h3 className="text-xl sm:text-2xl font-bold text-black mr-2">
            All Reviews
          </h3>
          <span className="text-sm sm:text-base text-black/60">
            ({reviewsData.length})
          </span>
        </div>
        <div className="flex items-center space-x-2.5">
          <Select defaultValue="latest">
            <SelectTrigger className="min-w-[120px] font-medium text-xs sm:text-base px-4 py-3 sm:px-5 sm:py-4 text-black bg-[#F0F0F0] border-none rounded-full h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="most-relevant">Most Relevant</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="sm:min-w-[166px] px-4 py-3 sm:px-5 sm:py-4 rounded-full bg-black font-medium text-xs sm:text-base h-12"
              >
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>Share your thoughts about this product.</DialogDescription>
              </DialogHeader>
              <WriteReviewForm productId={productId} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 sm:mb-9">
        {reviewsData.length > 0 ? (
          reviewsData.map((review) => (
            <ReviewCard
              key={review._id}
              data={review}
              isAction
              isDate
            />
          ))
        ) : (
          <p className="text-sm text-neutral-500 col-span-2">No reviews yet.</p>
        )}
      </div>
      {reviewsData.length > 0 && (
        <div className="w-full px-4 sm:px-0 text-center">
          <button
            // href={`/product/${productId}/reviews`} 
            className="inline-block w-[230px] px-11 py-4 border rounded-full hover:bg-black hover:text-white text-black transition-all font-medium text-sm sm:text-base border-black/10"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </section>
  );
};

export default ReviewsContent;
