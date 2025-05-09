"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BookService } from "@/services/book-service";
import { ReviewService } from "@/services/review-service";
import type { Book } from "@/types/book";
import type { Review } from "@/types/review";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReviewList from "@/components/reviews/review-list";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  bookId: z.string().min(1, { message: "Selecione um livro" }),
  rating: z.string().min(1, { message: "Selecione uma nota" }),
  comment: z.string().optional(),
});

export default function ReviewsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookId: "",
      rating: "",
      comment: "",
    },
  });

  const fetchBooks = async () => {
    try {
      const data = await BookService.getBooks();
      setBooks(data);

      if (!selectedBookId && data.length > 0) {
        setSelectedBookId(data[0].id);
        fetchReviewsByBook(data[0].id);
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar livros",
        description: "Não foi possível carregar a lista de livros.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsByBook = async (bookId: string) => {
    try {
      const data = await ReviewService.getReviewsByBook(bookId);
      setReviews(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar avaliações",
        description: "Não foi possível carregar as avaliações deste livro.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // fetchBooks();
    setBooks([
      {
        id: "1",
        title: "Livro 1",
        author: "Autor 1",
      },
    ]);
    // Polling a cada 10 segundos
    const interval = setInterval(() => {
      fetchBooks();
      if (selectedBookId) {
        fetchReviewsByBook(selectedBookId);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      await ReviewService.createReview({
        bookId: values.bookId,
        rating: Number.parseInt(values.rating),
        comment: values.comment || "",
      });

      toast({
        title: "Avaliação cadastrada",
        description: "A avaliação foi cadastrada com sucesso!",
      });

      form.reset();

      // Atualiza a lista de avaliações para o livro selecionado
      if (selectedBookId) {
        fetchReviewsByBook(selectedBookId);
      }
    } catch (error) {
      toast({
        title: "Erro ao cadastrar avaliação",
        description: "Não foi possível cadastrar a avaliação.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookChange = (bookId: string) => {
    setSelectedBookId(bookId);
    fetchReviewsByBook(bookId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerenciamento de Avaliações
        </h1>
        <p className="text-muted-foreground">
          Cadastre e visualize avaliações dos livros
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Nova Avaliação</CardTitle>
            <CardDescription>Avalie um livro do catálogo</CardDescription>
          </CardHeader>
          <CardContent>
            {books.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum livro cadastrado. Cadastre um livro primeiro para poder
                avaliá-lo.
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="bookId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Livro*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white text-black border border-gray-300 hover:bg-gray-100">
                              <SelectValue placeholder="Selecione um livro" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white text-black border border-gray-300">
                            {books.map((book) => (
                              <SelectItem key={book.id} value={book.id}>
                                {book.title} - {book.author}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nota*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white text-black border border-gray-300 hover:bg-gray-100">
                              <SelectValue placeholder="Selecione uma nota" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white text-black border border-gray-300">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <SelectItem
                                key={rating}
                                value={rating.toString()}
                                className="hover:bg-gray-100 text-black"
                              >
                                {rating} {rating === 1 ? "estrela" : "estrelas"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comentário</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Digite seu comentário sobre o livro"
                            className="resize-none bg-white text-black border border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar Avaliação"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliações</CardTitle>
            <CardDescription>Visualize as avaliações por livro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Filtrar por livro
                </label>
                <Select
                  onValueChange={handleBookChange}
                  value={selectedBookId || ""}
                  disabled={books.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um livro" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title} - {book.author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ReviewList
                reviews={reviews}
                loading={loading}
                onRefresh={() =>
                  selectedBookId && fetchReviewsByBook(selectedBookId)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
