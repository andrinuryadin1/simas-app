import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "@/components/auth-provider";
import { Toast } from "@/components/ui/toast";
import "./globals.css";

const plusJakartaSans = localFont({
  src: "./fonts/plus-jakarta-sans-latin.woff2",
  variable: "--font-plus-jakarta",
  weight: "400 800",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "400 600",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  variable: "--font-jetbrains-mono",
  weight: "400 600",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SiMas - Sistem Informasi Manajemen Santri | Kuttab Al-Fatih Bandung",
    template: "%s | SiMas Kuttab Al-Fatih",
  },
  description: "Platform digital terpusat rekam jejak tumbuh kembang santri Kuttab Al-Fatih Bandung — Tahfidz, Adab, Berhitung, Calistung, Absensi, dan Riwayat Khusus.",
  keywords: ["SiMas", "Kuttab Al-Fatih", "Sistem Informasi Santri", "Tahfidz", "Adab", "Bandung"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <AuthProvider>{children}</AuthProvider>
        <Toast position="top-right" richColors />
      </body>
    </html>
  );
}
