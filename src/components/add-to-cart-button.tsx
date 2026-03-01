"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Button
      size="lg"
      className="w-full rounded-full"
      disabled={disabled}
      onClick={() => {
        const added = addItem(product);
        if (added) {
          toast.success(`${product.name} added to cart`);
        } else {
          toast.error(`Not enough stock — only ${product.stock} available`);
        }
      }}
    >
      <ShoppingBag className="mr-2 h-5 w-5" />
      {disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}
