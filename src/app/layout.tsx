import "./globals.css";
import Link from "next/link";

export const metadata = { title: process.env.STORE_NAME ?? "Checlo Chick" };

export default function RootLayout({ children}:{children:React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <header className="border-b">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold">
              {process.env.STORE_NAME ?? "Checlo Chick"}
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/menu">Menu</Link>
              <Link href="/checkout">Checkout</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
        <footer className="container py-10 text-sm text-gray-500">
          © {new Date().getFullYear()} Checlo Chick
        </footer>
      </body>
    </html>
  );
}
