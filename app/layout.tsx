import type { Metadata } from "next";
// import localFont from "next/font/local";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider" 
import { Space } from "lucide-react";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin-ext"] });




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
      <body
        className={spaceGrotesk.className}
      >
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
