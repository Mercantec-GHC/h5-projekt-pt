import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "./globals.css";
import Navbar from "./components/navbar";
import { CartProvider } from "./components/cart-context";
import CartSidebar from "./components/cart-sidebar";

config.autoAddCss = false;

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "PT Market | Your one-stop shop for all your needs",
    description: "Phami & Teis",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <CartProvider>
                    <Navbar />
                    {children}
                    <CartSidebar />
                </CartProvider>
            </body>
        </html>
    );
}
