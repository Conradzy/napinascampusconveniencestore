import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Corner | Convenience Store POS",
  description: "Snacks, sips, and school essentials. A simple cash-only campus convenience store POS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
