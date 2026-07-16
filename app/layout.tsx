import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const sora = Sora({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DayTick",
  description: "Track every day together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: "#18181b",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.1)",
    },
  }}
/>
        {children}
      </body>
    </html>
  );
}