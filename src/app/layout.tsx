import type { Metadata } from "next";
import { Roboto_Mono, Inknut_Antiqua, Poppins } from "next/font/google";
import "./globals.scss";

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const inknutAntiqua = Inknut_Antiqua({
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talks",
  description: "Presentations and talks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoMono.variable} ${inknutAntiqua.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
