import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider ,SignInButton,SignedIn,SignedOut} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Text to PDF",
  description: "Text to PDF is a simple app that allows you to chat to your PDF file.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         <section className="h-screen w-screen flex flex-col items-center justify-center">
<SignedOut>
  <section className="h-screen w-screen flex flex-col items-center justify-center">
    <SignInButton></SignInButton>
  </section>
</SignedOut>

<SignedIn>
  {children}
</SignedIn>
        </section>
      </body>
    </html>
    </ClerkProvider> 
  );
}

