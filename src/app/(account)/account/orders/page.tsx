import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const statusVariant = (status: string) => {
  switch (status) {
    case "PROCESSING": return "warning" as const;
    case "SHIPPED": return "default" as const;
    case "DELIVERED": return "success" as const;
    case "CANCELLED": return "destructive" as const;
    default: return "secondary" as const;
  }
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Package className="h-16 w-16 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium">No orders yet</p>
          <p className="text-sm text-muted-foreground">Your order history will appear here</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-sm font-medium">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                  <span className="font-semibold">{formatPrice(order.total)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span>
                        {item.product.name} <span className="text-muted-foreground">x{item.quantity}</span>
                      </span>
                      <span>{formatPrice(item.priceAtPurchase * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                {order.shippingAddress && (
                  <p className="mt-3 text-xs text-muted-foreground border-t pt-3">
                    Ships to: {order.shippingName}, {order.shippingAddress}, {order.shippingCity}, {order.shippingState} {order.shippingZip}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
