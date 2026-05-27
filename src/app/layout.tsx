import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project Vaasa Hub",
  description: "Data-driven proposal for a one-stop integration hub in Vaasa",
};

const sections = [
  { label: "Immigration", href: "#immigration" },
  { label: "Employment", href: "#employment" },
  { label: "University", href: "#university" },
  { label: "Business Case", href: "#business" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="min-h-screen bg-white text-[#202124]">
        <header className="sticky top-0 z-50 bg-white border-b border-[#DADCE0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-0.75 items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335] block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC04] block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8] block" />
              </div>
              <span className="font-medium text-[15px] text-[#202124] tracking-tight">
                Project Vaasa Hub
              </span>
            </div>
            <nav className="hidden sm:flex items-center gap-0.5">
              {sections.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="px-3 py-1.5 rounded-full text-sm text-[#5F6368] hover:text-[#202124] hover:bg-[#F8F9FA] transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-[#DADCE0] bg-[#F8F9FA]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5F6368]">
            <span>© 2025 Project Vaasa Hub</span>
            <span>
              Data: Statistics Finland · Vipunen.fi · City of Vaasa · Business Finland
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
