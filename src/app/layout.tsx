import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "International House Vaasa — Data Dashboard",
  description: "Data-driven analysis supporting the IH Vaasa proposal",
};

const navLinks = [
  { href: "/", label: "Overview" },
  { href: "/immigration", label: "Immigration" },
  { href: "/employment", label: "Employment" },
  { href: "/university", label: "University" },
  { href: "/business", label: "Business Case" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900 flex flex-col">
        <header className="bg-blue-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <p className="font-bold text-lg leading-tight">International House Vaasa</p>
                <p className="text-blue-300 text-xs">Data Analysis Dashboard</p>
              </div>
              <nav className="flex gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-3 py-2 rounded text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-800 transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-blue-900 text-blue-300 text-xs text-center py-3">
          Data sources: Statistics Finland (stat.fi) · Vipunen.fi · City of Vaasa · Business Finland
        </footer>
      </body>
    </html>
  );
}
