import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from "next-auth/next";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession();
  const isSuperAdmin = (session?.user as any)?.role === 'superadmin';

  if (!isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession();
  const isSuperAdmin = (session?.user as any)?.role === 'superadmin';

  if (!isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id, role } = await req.json();
    
    if (!id || !role) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
