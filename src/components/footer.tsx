import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight">STORE</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Premium products, curated with care. Your satisfaction is our priority.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Shop</h4>
            <ul className="mt-2 space-y-2">
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">All Products</Link></li>
              <li><Link href="/products?category=electronics" className="text-sm text-muted-foreground hover:text-foreground">Electronics</Link></li>
              <li><Link href="/products?category=clothing" className="text-sm text-muted-foreground hover:text-foreground">Clothing</Link></li>
              <li><Link href="/products?category=home-living" className="text-sm text-muted-foreground hover:text-foreground">Home & Living</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Account</h4>
            <ul className="mt-2 space-y-2">
              <li><Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">Sign In</Link></li>
              <li><Link href="/register" className="text-sm text-muted-foreground hover:text-foreground">Create Account</Link></li>
              <li><Link href="/account/orders" className="text-sm text-muted-foreground hover:text-foreground">Order History</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="mt-2 space-y-2">
              <li><span className="text-sm text-muted-foreground">help@store.com</span></li>
              <li><span className="text-sm text-muted-foreground">1-800-STORE</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} STORE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
