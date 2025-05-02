"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Livros",
      href: "/books",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
    },
    {
      name: "Avaliações",
      href: "/reviews",
      icon: <Star className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <header className=" ml-2 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl">Mini Catálogo</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
