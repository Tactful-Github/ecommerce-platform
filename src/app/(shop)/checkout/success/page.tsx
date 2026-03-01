import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { ClearCartOnSuccess } from "@/components/clear-cart-on-success";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
      <ClearCartOnSuccess />
      <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
      <h1 className="mt-4 text-3xl font-bold">Order Confirmed!</h1>
      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
        Thank you for your purchase. You&apos;ll receive a confirmation email shortly with your order details.
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link href="/account/orders">
          <Button variant="outline" className="rounded-full">View Orders</Button>
        </Link>
        <Link href="/products">
          <Button className="rounded-full">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
