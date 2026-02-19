import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const ysabeauOffice = localFont({
  src: [
    { path: "./fonts/YsabeauOffice.ttf", weight: "400", style: "normal" },
    { path: "./fonts/YsabeauOffice-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/YsabeauOffice-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/YsabeauOffice-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
  ],
  variable: "--font-ysabeau",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abhishek Kumar - Sviet @MrAbhi2k3",
  description: "Created By - @MrAbhi2k3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ysabeauOffice.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
