import axios from "axios"
import type { Book } from "@/types/book"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.15.10:50053"

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
      return response.data.books // conforme retorno do FastAPI
    } catch (error) {
      console.error("Error fetching books:", error)
      throw error
    }
  },

  async getBookById(id: string): Promise<Book> {
    try {
      const response = await axios.get(`${API_URL}/books/${id}`)
      return response.data // já é um único livro
    } catch (error) {
      console.error(`Error fetching book with id ${id}:`, error)
      throw error
    }
  },
}
