import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, archived: false },
    include: { category: true },
    take: 6,
  });

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-widest text-primary mb-4">Thoughtfully curated</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Where quality meets
              <span className="block mt-1 text-primary">everyday living</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Discover products that combine timeless design with sustainable craft.
              Every piece is chosen with care.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/products">
                <Button size="lg" className="rounded-full px-8">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products?category=home-living">
                <Button size="lg" variant="outline" className="rounded-full px-8 bg-background/50 backdrop-blur-sm">
                  Explore Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative flex h-44 items-end overflow-hidden rounded-xl bg-muted p-4 transition-all hover:shadow-lg"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="relative">
                <h3 className="font-semibold text-white text-lg">{cat.name}</h3>
                <p className="text-xs text-white/80">{cat._count.products} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
          <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
          {featuredProducts.map((product) => (
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
      </section>

      {/* CTA Banner */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            New arrivals every week
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/80">
            Subscribe to our newsletter and never miss out on exclusive deals and new collections.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 h-10 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
            />
            <Button variant="secondary" className="rounded-full">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
