
import type { Metadata, Viewport } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Amigo Secreto 2026 🎄",
    template: "%s | Amigo Secreto 2026",
  },

  description:
    "Uma tradição especial entre amigos! Participe do nosso Amigo Secreto 2026, compartilhe suas dicas de presentes e prepare-se para uma surpresa inesquecível.",

  applicationName: "Amigo Secreto 2026",

  robots: {
    index: false,
    follow: false,
  },

  appleWebApp: {
    capable: true,
    title: "Amigo Secreto",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#102C23",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
