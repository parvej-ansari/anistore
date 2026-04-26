import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: 'user'
    });

    return NextResponse.json({ success: true, user: { id: newUser._id, email: newUser.email, name: newUser.name } });
  } catch (error) {
    console.error("Sign-up Error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
