import type { Metadata } from "next";
import "./globals.css";
import PrelineScriptWrapper from './components/PrelineScriptWrapper';
import { Toaster } from 'react-hot-toast';


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
        {children}
        <PrelineScriptWrapper />
        <Toaster />
      </body>
    </html>
  );
}
