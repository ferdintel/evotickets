import { inter } from "./fonts";
import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import { StoreProvider } from "./StoreProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | evotickets",
    default: "Accueil | evotickets",
  },
  description:
    "Gérez la billetterie de votre évènement en toute simplicité. Suivez en temps réel l'évolution des ventes et évitez la fraude.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} antialiased`}>
      <body className={`px-4 mobileM:px-5 min-h-screen bg-gray-100 text-foreground font-inter`}>
        <StoreProvider>
          <Toaster />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
