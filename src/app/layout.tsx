import React from "react";
import Script from "next/script";
import { AudioLayout } from "./audioLayout";

import "./globals.css";
import "./globals2.css";
import "./globals3.css";
import "./globals4.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ARA", // Optional title
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        data-goatcounter="https://ara.goatcounter.com/count"
        async
        src="//gc.zgo.at/count.js"
        strategy="afterInteractive"
      />
      <AudioLayout>{children}</AudioLayout>
    </>
  );
}
