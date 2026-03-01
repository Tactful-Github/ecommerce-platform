"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export function ProductCard({ id, name, price, image, category, stock }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const added = addItem({ id, name, price, image, stock });
    if (added) {
      toast.success(`${name} added to cart`);
    } else {
      toast.error(`Not enough stock — only ${stock} available`);
    }
  };

  return (
    <Link href={`/products/${id}`}>
      <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          {stock > 0 && (
            <Button
              size="icon"
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardContent className="px-1 pt-3 pb-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{category}</p>
          <h3 className="mt-1 font-medium text-sm leading-tight line-clamp-1">{name}</h3>
          <p className="mt-1 font-semibold text-sm">{formatPrice(price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
