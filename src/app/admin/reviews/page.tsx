"use client";

import { useState } from "react";
import {
  useGetReviewsQuery,
  useBulkUpdateReviewsMutation,
  useUpdateReviewMutation,
} from "@/apis/review.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";
import Rating from "@/components/ui/Rating";

const statusColors = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  spam: "bg-red-100 text-red-800",
  trash: "bg-gray-100 text-gray-800",
};

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [perPage, setPerPage] = useState(10);

  const {
    data: reviewsData,
    isLoading,
    refetch,
  } = useGetReviewsQuery({
    perPage,
    status: statusFilter,
  });

  const [bulkUpdateReviews, { isLoading: isBulkUpdating }] =
    useBulkUpdateReviewsMutation();

  const [updateReview] = useUpdateReviewMutation();

  const reviews = reviewsData?.data || [];

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || review.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReviews(filteredReviews.map((review) => review._id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectReview = (reviewId: string, checked: boolean) => {
    if (checked) {
      setSelectedReviews((prev) => [...prev, reviewId]);
    } else {
      setSelectedReviews((prev) => prev.filter((id) => id !== reviewId));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedReviews.length === 0) {
      toast.error("Please select reviews to perform this action");
      return;
    }

    try {
      await bulkUpdateReviews({
        ids: selectedReviews,
        action,
      }).unwrap();

      toast.success(`Reviews ${action} successfully`);
      setSelectedReviews([]);
      refetch();
    } catch (error) {
      toast.error(`Failed to ${action} reviews`);
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      await updateReview({ id: reviewId, data: { status: "approved" } }).unwrap();
      toast.success("Review approved successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to approve review");
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      await updateReview({ id: reviewId, data: { status: "trash" } }).unwrap();
      toast.success("Review rejected successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to reject review");
    }
  };

  const getStatusBadge = (status: string) => (
    <Badge className={statusColors[status as keyof typeof statusColors]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Reviews</h1>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <div className="text-sm text-gray-600">
          {filteredReviews.length} of {reviews.length} reviews
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
              <SelectItem value="trash">Trash</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={perPage.toString()}
            onValueChange={(value) => setPerPage(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedReviews.length} review(s) selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleBulkAction("approve")}
              disabled={isBulkUpdating}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("spam")}
              disabled={isBulkUpdating}
            >
              Mark as Spam
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("trash")}
              disabled={isBulkUpdating}
            >
              Move to Trash
            </Button>
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedReviews.length === filteredReviews.length &&
                    filteredReviews.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedReviews.includes(review._id)}
                    onCheckedChange={(checked) =>
                      handleSelectReview(review._id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{review.reviewer}</div>
                    <div className="text-sm text-gray-500">
                      {review.reviewer_email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Rating
                    initialValue={review.rating}
                    readonly
                    size={16}
                    allowFraction={false}
                  />
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={review.review}>
                    {review.review}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">
                    {format(new Date(review.createdAt), "MMM dd, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleApprove(review._id)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(review._id)}>
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reviews found matching your criteria.
        </div>
      )}
    </div>
  );
}
