"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { AudioLayout } from "./audioLayout";

import "./globals.css";
import "./globals2.css";
import "./globals3.css";
import "./globals4.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AudioLayout children={children}></AudioLayout>;
}
