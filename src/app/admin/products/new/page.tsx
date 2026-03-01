import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
      <p className="text-sm text-muted-foreground mt-1">Fill in the details below</p>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
