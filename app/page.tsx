import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Mini Catálogo de Livros
        </h1>
        <p className="text-muted-foreground max-w-[600px]">
          Gerencie sua coleção de livros e avaliações de forma simples e
          eficiente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Gerenciar Livros
            </CardTitle>
            <CardDescription>
              Cadastre, visualize e gerencie seu catálogo de livros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Acessar Livros
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Gerenciar Avaliações
            </CardTitle>
            <CardDescription>
              Registre e consulte avaliações dos livros cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reviews" passHref>
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                color="white"
              >
                Acessar Avaliações
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
