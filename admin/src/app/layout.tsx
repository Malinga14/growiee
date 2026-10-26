import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { site } from "@/config/site";

// Brand fonts, self-hosted from branding/brand-guidelines/fonts.
const googleSans = localFont({
  src: "../fonts/GoogleSans.ttf",
  variable: "--font-sans",
  weight: "400 700",
  display: "swap",
});
const nunito = localFont({
  src: "../fonts/Nunito.ttf",
  variable: "--font-display",
  weight: "200 1000",
  display: "swap",
});
const pacifico = localFont({
  src: "../fonts/Pacifico-Regular.ttf",
  variable: "--font-wordmark",
  weight: "400",
  display: "swap",
});

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#FDFDFD",
};

export const metadata: Metadata = {
  title: {
    template: `%s | ${site.name}`,
    default: site.name,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${googleSans.variable} ${nunito.variable} ${pacifico.variable}`}
    >
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
