import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { ProductFilters } from "@/components/product-filters";

interface Props {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { category, search, sort } = params;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const where: Record<string, unknown> = { archived: false };
  if (category) {
    where.category = { slug: category };
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {category ? categories.find(c => c.slug === category)?.name ?? "Products" : "All Products"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      <ProductFilters categories={categories} />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category.name}
              stock={product.stock}
            />
          ))}
        </div>
      )}
    </div>
  );
}
