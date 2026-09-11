import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { AuthProvider } from "@/components/AuthContext";
import { WishlistProvider } from "@/components/WishlistContext";
import { LanguageProvider } from "@/components/LanguageProvider";
import AppChrome from "@/components/AppChrome";

export const metadata: Metadata = {
  title: "Euphoria | Modern essentials",
  description: "A considered collection of everyday apparel from Euphoria."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AppChrome>{children}</AppChrome>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
