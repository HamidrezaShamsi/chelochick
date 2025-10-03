import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone } = body ?? {};
    
    if (!email || !password || !name) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: String(email) }
    });

    if (existingUser) {
      return Response.json({ message: "User with this email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(String(password), 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: String(email),
        password: hashedPassword,
        name: String(name),
        phone: phone ? String(phone) : null
      }
    });

    return Response.json({ 
      ok: true, 
      user: { id: user.id, email: user.email, name: user.name } 
    });

  } catch (error: any) {
    console.error("Registration error:", error);
    return Response.json({ message: "Server error: " + error.message }, { status: 500 });
  }
}