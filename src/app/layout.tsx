import type { Metadata } from "next";
import { Roboto_Mono, Inknut_Antiqua } from "next/font/google";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://talks.mcclowes.com";

export const metadata: Metadata = {
  title: {
    default: "Talks — Max Clayton Clowes",
    template: "%s — Talks by Max Clayton Clowes",
  },
  description:
    "Presentations and talks by Max Clayton Clowes on developer experience, documentation, and AI.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Talks — Max Clayton Clowes",
    title: "Talks — Max Clayton Clowes",
    description:
      "Presentations and talks by Max Clayton Clowes on developer experience, documentation, and AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talks — Max Clayton Clowes",
    description:
      "Presentations and talks by Max Clayton Clowes on developer experience, documentation, and AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${robotoMono.variable} ${inknutAntiqua.variable}`}>
        {children}
      </body>
    </html>
  );
}
