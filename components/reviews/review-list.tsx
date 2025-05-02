"use client";

import type { Review } from "@/types/review";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StarRating } from "@/components/reviews/star-rating";

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
  onRefresh: () => void;
}

export default function ReviewList({
  reviews,
  loading,
  onRefresh,
}: ReviewListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="bg-blue-500 hover:bg-blue-600 text-white"
          size="sm"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma avaliação encontrada para este livro.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <StarRating rating={review.rating} />
                  <p className="text-sm text-muted-foreground">
                    {review.comment || "Sem comentários."}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString("pt-BR")}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
