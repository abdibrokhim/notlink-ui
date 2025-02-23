'use client'

import React, { useState } from "react";
import Shorten from "@/components/shorten";
import { Analytics } from "@vercel/analytics/react";
import Layout from "@/components/app/layout";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { MoonIcon, SparklesIcon, SunIcon } from "lucide-react";

export default function Home() {
  const [showMessage, setShowMessage] = useState(true);
  return (
    <Layout>
      <Analytics />
      <div className="py-8 max-w-2xl space-y-16 w-full">
        <Shorten />
      </div>
    </Layout>
  );
}
