import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { Providers } from "@/components/Providers";
import "@/styles/tokens.css";
import "@/styles/themes.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LPJ Statistics Components Playground",
  description: "Interactive chart prototyping playground for annual accountability report",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={fraunces.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
