import type { Metadata } from "next";
import { Manrope, Noto_Serif } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const notoSerif = Noto_Serif({ subsets: ["latin"], variable: "--font-noto-serif" });

export const metadata: Metadata = {
  title: "Elimina lo que bloquea tu dinero en 3 días",
  description: "Reto premium de 3 días para detectar el patrón que bloquea tu relación con el dinero.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${notoSerif.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
