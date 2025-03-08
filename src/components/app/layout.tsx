'use client'

import React from 'react';
import Header from './header';
import Footer from './footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center relative mx-auto w-full max-w-screen-sm">
        {children}
      </main>
        <Footer />
    </div>
  );
}
