import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Providers } from "@/components/Providers/Providers";

export const metadata: Metadata = {
    title: "BeLean",
    description: "Fitness UI/UX site for asking fitness questions",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                <main className="relative overflow-hidden">
                    <Providers>{children}</Providers>
                </main>
                <Footer />
            </body>
        </html>
    );
}
