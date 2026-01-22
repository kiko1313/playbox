import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Correct import for App Router
import "./globals.css";
import NavBar from "@/components/NavBar";

// Initialize font
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "PlayBox | Premium Streaming",
  description: "Unlimited Stream / Zero Limits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <NavBar />
        <main className="main-container">
          {children}
        </main>
      </body>
    </html>
  );
}
