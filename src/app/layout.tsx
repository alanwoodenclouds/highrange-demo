import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/shared/theme-provider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Highrange Home Appliances | Premium Electronics in Idukki",
    template: "%s | Highrange Home Appliances",
  },
  description:
    "Premium home appliances and electronics across Idukki. TVs, ACs, refrigerators, mobiles & more with free delivery and EMI options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
