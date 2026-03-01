import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export default async function AdminDashboard() {
  const [totalRevenue, totalOrders, totalProducts, totalCustomers, recentOrders] =
    await Promise.all([
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count(),
      prisma.product.count({ where: { archived: false } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true, items: true },
      }),
    ]);

  const stats = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue._sum.total ?? 0),
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: totalProducts.toString(),
      icon: Package,
    },
    {
      title: "Customers",
      value: totalCustomers.toString(),
      icon: Users,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-sm text-muted-foreground mt-1">Overview of your store</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <div className="mt-4 space-y-3">
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No orders yet</p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium text-sm">{order.user.name}</p>
                  <p className="text-xs text-muted-foreground">{order.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
