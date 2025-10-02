import { cookies } from "next/headers";

export async function POST(req:Request){
  const { password } = await req.json();
  if (password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
    cookies().set("admin_auth", "1", { httpOnly:true, sameSite:"lax", secure:false, path:"/", maxAge:60*60*8 });
    return Response.json({ ok:true });
  }
  return new Response("Unauthorized", { status:401 });
}