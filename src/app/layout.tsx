import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "The Ton — Where Society Whispers",
  description:
    "An exclusive, Regency-era inspired social app where friends anonymously 'spill the tea' and an AI Lady Whistledown weaves daily society letters.",
  keywords: ["social app", "anonymous", "whispers", "Lady Whistledown", "Regency"],
  openGraph: {
    title: "The Ton — Where Society Whispers",
    description:
      "Join the most exclusive society. Submit anonymous whispers, receive daily AI-crafted letters.",
    type: "website",
  },
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
        <main>{children}</main>
      </body>
    </html>
  );
}
