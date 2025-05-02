"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BookService } from "@/services/book-service";
import type { Book } from "@/types/book";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import BookList from "@/components/books/book-list";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, { message: "O título é obrigatório" }),
  author: z.string().min(1, { message: "O autor é obrigatório" }),
  description: z.string().optional(),
  year: z.string().optional(),
});

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      year: "",
    },
  });

  const fetchBooks = async () => {
    try {
      const data = await BookService.getBooks();
      setBooks(data);
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

  useEffect(() => {
    fetchBooks();

    // Polling a cada 10 segundos
    const interval = setInterval(() => {
      fetchBooks();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      await BookService.createBook({
        title: values.title,
        author: values.author,
        description: values.description || "",
        year: values.year ? Number.parseInt(values.year) : undefined,
      });

      toast({
        title: "Livro cadastrado",
        description: "O livro foi cadastrado com sucesso!",
      });

      form.reset();
      fetchBooks();
    } catch (error) {
      toast({
        title: "Erro ao cadastrar livro",
        description: "Não foi possível cadastrar o livro.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerenciamento de Livros
        </h1>
        <p className="text-muted-foreground">
          Cadastre e visualize seu catálogo de livros
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Novo Livro</CardTitle>
            <CardDescription>
              Preencha os dados para adicionar um novo livro ao catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o título do livro"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autor*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome do autor"
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
                    "Cadastrar Livro"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Livros Cadastrados</CardTitle>
            <CardDescription>
              Lista de todos os livros no catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookList books={books} loading={loading} onRefresh={fetchBooks} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
