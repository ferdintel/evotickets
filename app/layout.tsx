import { fontSans } from "./fonts";
import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Evotickets",
  description:
    "Gérez la billetterie de votre évènement en toute simplicité. Suivez en temps réel l'évolution des ventes et évitez la fraude.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fontSans.variable} antialiased`}>
      <body
        className={`px-4 mobileM:px-5 min-h-screen flex flex-col bg-background text-foreground font-inter`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
