"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { createProduct, updateProduct } from "@/actions/products";
import { toast } from "sonner";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  featured: boolean;
  archived: boolean;
  image: string;
}

interface Props {
  categories: Category[];
  product?: ProductData;
}

export function ProductForm({ categories, product }: Props) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.image ?? "");
  const [imageMode, setImageMode] = useState<"url" | "upload">(
    product?.image?.startsWith("/uploads/") ? "upload" : "url"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!product;

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        toast.success("Image uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("imageUrl", imageUrl);

    try {
      let result;
      if (isEditing) {
        result = await updateProduct(product.id, formData);
      } else {
        result = await createProduct(formData);
      }

      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={product?.description}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock ?? 0}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select id="categoryId" name="categoryId" defaultValue={product?.categoryId} required>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Image Section */}
        <div className="space-y-3 sm:col-span-2">
          <Label>Product Image</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={imageMode === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setImageMode("upload")}
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Upload
            </Button>
            <Button
              type="button"
              variant={imageMode === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setImageMode("url")}
            >
              <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
              URL
            </Button>
          </div>

          {imageMode === "upload" ? (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed h-20"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Click to upload an image
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          )}

          {imageUrl && (
            <div className="relative inline-block">
              <div className="relative h-32 w-32 overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setImageUrl("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured}
              className="rounded border-gray-300"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="archived"
              defaultChecked={product?.archived}
              className="rounded border-gray-300"
            />
            Archived
          </label>
        </div>
      </div>

      <Button type="submit" disabled={loading || uploading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
