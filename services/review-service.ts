import axios from "axios"
import type { Review } from "@/types/review"

// Base URL para o API Gateway HTTP
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface CreateReviewDto {
  bookId: string
  rating: number
  comment?: string
}

export const ReviewService = {
  async getReviews(): Promise<Review[]> {
    try {
      const response = await axios.get(`${API_URL}/reviews`)
      return response.data
    } catch (error) {
      console.error("Error fetching reviews:", error)
      throw error
    }
  },

  async getReviewsByBook(bookId: string): Promise<Review[]> {
    try {
      const response = await axios.get(`${API_URL}/reviews?bookId=${bookId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching reviews for book ${bookId}:`, error)
      throw error
    }
  },

  async createReview(review: CreateReviewDto): Promise<Review> {
    try {
      const response = await axios.post(`${API_URL}/reviews`, review)
      return response.data
    } catch (error) {
      console.error("Error creating review:", error)
      throw error
    }
  },
}
