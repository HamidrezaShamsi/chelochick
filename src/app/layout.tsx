import "./globals.css";
import Link from "next/link";
import CartButton from "@/components/CartButton";

export const metadata = { title: process.env.STORE_NAME ?? "Checlo Chick" };

export default function RootLayout({ children}:{children:React.ReactNode}) {
  return (
    <html lang="en"><body>
      <header className="border-b">
        <div className="container py-4 flex items-center justify-between">
          {/* Left: brand + Menu */}
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold">
              {process.env.STORE_NAME ?? "Checlo Chick"}
            </Link>
            <nav className="hidden sm:flex gap-4 text-sm">
              <Link href="/menu">Menu</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>

          {/* Right: login / register / cart */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn border">Login</Link>
            <Link href="/register" className="btn border">Register</Link>
            <CartButton />
          </div>
        </div>
      </header>

      <main className="container py-6">{children}</main>
      <footer className="container py-10 text-sm text-gray-500">© {new Date().getFullYear()} Checlo Chick</footer>
    </body></html>
  );
}
