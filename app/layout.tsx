import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelCircle } from "geist/font/pixel";
import { Space_Mono, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/layout/Sidebar";
import ShaderBackground from "@/components/layout/ShaderBackground";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Personal command center for everything that matters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistPixelCircle.className} ${GeistSans.variable} ${GeistMono.variable} ${spaceMono.variable} ${ibmPlex.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ background: "transparent", color: "var(--text-primary)" }}
      >
        <ThemeProvider>
          <ConvexClientProvider>
            <ShaderBackground />
            <div className="relative" style={{ zIndex: 1 }}>
              <Sidebar />
              <main className="min-h-screen pt-[60px]">
                {children}
              </main>
            </div>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
