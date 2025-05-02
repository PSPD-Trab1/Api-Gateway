import axios from "axios"
import type { Book } from "@/types/book"

// Base URL para o API Gateway HTTP
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface CreateBookDto {
  title: string
  author: string
  description?: string
  year?: number
}

export const BookService = {
  async getBooks(): Promise<Book[]> {
    try {
      const response = await axios.get(`${API_URL}/books`)
      return response.data
    } catch (error) {
      console.error("Error fetching books:", error)
      throw error
    }
  },

  async getBookById(id: string): Promise<Book> {
    try {
      const response = await axios.get(`${API_URL}/books/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching book with id ${id}:`, error)
      throw error
    }
  },

  async createBook(book: CreateBookDto): Promise<Book> {
    try {
      const response = await axios.post(`${API_URL}/books`, book)
      return response.data
    } catch (error) {
      console.error("Error creating book:", error)
      throw error
    }
  },
}
