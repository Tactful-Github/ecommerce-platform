import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      hashedPassword: adminPassword,
      role: "ADMIN",
    },
  });

  // Create demo customer
  const customerPassword = await bcrypt.hash("customer123", 12);
  await prisma.user.create({
    data: {
      name: "Jane Doe",
      email: "jane@example.com",
      hashedPassword: customerPassword,
      role: "CUSTOMER",
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electronics",
        slug: "electronics",
        image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80",
      },
    }),
    prisma.category.create({
      data: {
        name: "Clothing",
        slug: "clothing",
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
      },
    }),
    prisma.category.create({
      data: {
        name: "Home & Living",
        slug: "home-living",
        image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&q=80",
      },
    }),
    prisma.category.create({
      data: {
        name: "Accessories",
        slug: "accessories",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
      },
    }),
  ]);

  const [electronics, clothing, home, accessories] = categories;

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: "Wireless Noise-Cancelling Headphones",
        description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio. Perfect for music lovers and remote workers.",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        stock: 50,
        featured: true,
        categoryId: electronics.id,
      },
      {
        name: "Minimalist Smartwatch",
        description: "Sleek smartwatch with health tracking, notifications, and a stunning AMOLED display. Water resistant to 50 meters.",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
        stock: 35,
        featured: true,
        categoryId: electronics.id,
      },
      {
        name: "Portable Bluetooth Speaker",
        description: "Compact waterproof speaker with rich 360-degree sound. 12-hour battery and built-in microphone for calls.",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
        stock: 80,
        featured: false,
        categoryId: electronics.id,
      },
      {
        name: "Organic Cotton T-Shirt",
        description: "Ultra-soft organic cotton tee in a relaxed fit. Sustainably sourced and ethically manufactured.",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
        stock: 120,
        featured: true,
        categoryId: clothing.id,
      },
      {
        name: "Slim Fit Chinos",
        description: "Classic slim-fit chinos crafted from premium stretch cotton. Versatile enough for work or weekend.",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
        stock: 75,
        featured: false,
        categoryId: clothing.id,
      },
      {
        name: "Merino Wool Sweater",
        description: "Luxuriously soft merino wool crew neck sweater. Naturally temperature-regulating and odor-resistant.",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
        stock: 40,
        featured: true,
        categoryId: clothing.id,
      },
      {
        name: "Ceramic Pour-Over Coffee Set",
        description: "Handcrafted ceramic dripper and carafe set for the perfect pour-over coffee. Includes reusable filter.",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
        stock: 60,
        featured: false,
        categoryId: home.id,
      },
      {
        name: "Scented Soy Candle Set",
        description: "Set of 3 hand-poured soy candles in calming scents: lavender, vanilla, and cedar. 40-hour burn time each.",
        price: 38.99,
        image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&q=80",
        stock: 90,
        featured: false,
        categoryId: home.id,
      },
      {
        name: "Linen Throw Blanket",
        description: "Breathable stonewashed linen throw in a natural palette. Perfect for layering on your sofa or bed.",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
        stock: 30,
        featured: true,
        categoryId: home.id,
      },
      {
        name: "Leather Minimalist Wallet",
        description: "Slim full-grain leather wallet with RFID protection. Holds up to 8 cards and features a hidden cash slot.",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
        stock: 100,
        featured: false,
        categoryId: accessories.id,
      },
      {
        name: "Classic Aviator Sunglasses",
        description: "Timeless aviator sunglasses with polarized lenses and lightweight titanium frames. UV400 protection.",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
        stock: 55,
        featured: true,
        categoryId: accessories.id,
      },
      {
        name: "Canvas Tote Bag",
        description: "Durable heavyweight canvas tote with reinforced handles and interior pocket. Built to last.",
        price: 28.99,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80",
        stock: 150,
        featured: false,
        categoryId: accessories.id,
      },
    ],
  });

  console.log("Database seeded successfully!");
  console.log("Admin login: admin@example.com / admin123");
  console.log("Customer login: jane@example.com / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
