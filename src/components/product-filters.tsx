"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCallback, useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          current.set(key, value);
        } else {
          current.delete(key);
        }
      });
      return current.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/products?${createQueryString({ search })}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, router, createQueryString]);

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs"
      />
      <Select
        value={searchParams.get("category") ?? ""}
        onChange={(e) =>
          router.push(`/products?${createQueryString({ category: e.target.value })}`)
        }
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </Select>
      <Select
        value={searchParams.get("sort") ?? ""}
        onChange={(e) =>
          router.push(`/products?${createQueryString({ sort: e.target.value })}`)
        }
      >
        <option value="">Newest First</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name: A-Z</option>
      </Select>
    </div>
  );
}
