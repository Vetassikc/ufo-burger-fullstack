// src/app/layout.tsx

import type { Metadata } from "next"; // Додаємо тип для Metadata
import { Orbitron, Montserrat } from "next/font/google";
import "@/styles/globals.scss"; // Переконуємось, що правильний файл стилів
import { CartProvider } from "@/context/CartContext";
import MainLayout from "@/components/MainLayout";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700"], variable: "--font-orbitron" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-montserrat" });

// Додамо базові метадані
export const metadata: Metadata = {
  title: "UFO Burger",
  description: "Космічні бургери, неземний смак!",
};

// Додаємо правильні типи для props
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={`${orbitron.variable} ${montserrat.variable}`} suppressHydrationWarning={true}>
        <CartProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </CartProvider>
      </body>
    </html>
  );
}