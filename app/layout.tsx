import type { Metadata } from "next";
import "./globals.css";
import PrelineScriptWrapper from './components/PrelineScriptWrapper';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';


export const metadata: Metadata = {
  title: "Questcore Learning Hub",
  description: "Created by Soh_nia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light dark:bg-neutral-900">
      <body
        className=''
      >
        <SessionProvider>
          {children}
          <PrelineScriptWrapper />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
