import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getServerSession } from "next-auth/next";
import { seedDatabase } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    // Auto-seed if empty (useful for first run)
    await seedDatabase();
    
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  const isAdmin = (session?.user as any)?.isAdmin;

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();
    
    // Convert price to number if it's a string
    const formattedBody = {
      ...body,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
    };

    const newProduct = await Product.create(formattedBody);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Add Product Error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession();
  const isAdmin = (session?.user as any)?.isAdmin;

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
