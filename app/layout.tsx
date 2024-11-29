import { inter } from "./fonts";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | evotickets",
    default: "Accueil | evotickets",
  },
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} antialiased`}>
      <body
        className={`bg-background text-foreground font-inter`}
      >
        {children}
      </body>
    </html>
  );
}
