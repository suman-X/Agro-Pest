import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Pest Detection",
  description: "AI-powered pest detection and treatment recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
