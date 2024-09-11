import type { Metadata } from "next";
import "./globals.css";
import { Recursive } from "next/font/google";

const recursive = Recursive({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Product Hunt",
  description: "Discover, share, and upvote the best new applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>{children}</body>
    </html>
  );
}
