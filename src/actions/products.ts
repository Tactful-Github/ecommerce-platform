"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    featured: formData.get("featured") === "on",
    archived: formData.get("archived") === "on",
    image: formData.get("imageUrl") as string || "/placeholder.svg",
  };

  const validated = productSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  await prisma.product.create({
    data: {
      name: validated.data.name,
      description: validated.data.description,
      price: validated.data.price,
      stock: validated.data.stock,
      categoryId: validated.data.categoryId,
      featured: validated.data.featured,
      archived: validated.data.archived,
      image: validated.data.image || "/placeholder.svg",
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    featured: formData.get("featured") === "on",
    archived: formData.get("archived") === "on",
    image: formData.get("imageUrl") as string || undefined,
  };

  const validated = productSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const updateData: Record<string, unknown> = {
    name: validated.data.name,
    description: validated.data.description,
    price: validated.data.price,
    stock: validated.data.stock,
    categoryId: validated.data.categoryId,
    featured: validated.data.featured,
    archived: validated.data.archived,
  };

  if (validated.data.image) {
    updateData.image = validated.data.image;
  }

  await prisma.product.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  await prisma.product.update({
    where: { id },
    data: { archived: true },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
}
