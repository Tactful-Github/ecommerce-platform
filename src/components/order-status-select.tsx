"use client";

import { Select } from "@/components/ui/select";
import { updateOrderStatus } from "@/actions/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    try {
      await updateOrderStatus(orderId, e.target.value);
      toast.success("Order status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    }
  }

  return (
    <Select defaultValue={currentStatus} onChange={handleChange} className="w-36 text-xs">
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </Select>
  );
}
