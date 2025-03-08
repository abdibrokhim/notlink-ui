'use client'

import React from 'react';
import Header from './header';
import Footer from './footer';
import BuiltWith from '../BuiltWith';
import Ads from '../Ads';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <Ads />
      <main className="flex-1 flex items-center justify-center relative mx-auto w-full max-w-screen-sm">
        {children}
      </main>
      <BuiltWith />
      <Footer />
    </div>
  );
}
