import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Talos Informa", template: "%s | Talos Informa" },
  description:
    "Talos agrupa las noticias de un mismo hecho publicadas por diez medios chilenos y muestra cómo se reparte su cobertura entre izquierda, centro y derecha.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-gray-500 sm:px-6">
            Talos contrasta coberturas: no califica si un hecho es verdadero ni recomienda medios. Proyecto Capstone, Duoc UC, 2026.
          </div>
        </footer>
      </body>
    </html>
  );
}
