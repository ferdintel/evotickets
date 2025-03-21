import { Quicksand } from "next/font/google";

export const fontSans = Quicksand({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  adjustFontFallback: false,
  preload: true,
});
