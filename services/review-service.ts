import axios from "axios"
import type { Review } from "@/types/review"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:50053"

export interface CreateReviewDto {
  bookId: string
  rating: number
  comment?: string
}

export const ReviewService = {
  async getReviewsByBook(bookId: string): Promise<Review[]> {
    try {
      const response = await axios.get(`${API_URL}/books/${bookId}/reviews`)
      return response.data.reviews // conforme retorno do FastAPI
    } catch (error) {
      console.error(`Error fetching reviews for book ${bookId}:`, error)
      throw error
    }
  },

  async createReview(review: CreateReviewDto): Promise<{ message: string }> {
    try {
      const response = await axios.post(
        `${API_URL}/books/${review.bookId}/reviews`,
        {
          rating: review.rating,
          comment: review.comment || "",
        }
      )
      return response.data
    } catch (error) {
      console.error("Error creating review:", error)
      throw error
    }
  },
}
