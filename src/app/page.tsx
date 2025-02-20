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
      <a 
          className="flex mx-auto items-center justify-center"
          href="https://www.producthunt.com/posts/notlink?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-notlink" 
          target="_blank">
            <Image 
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=886596&theme=light&t=1739803124250"
              alt="notlink - open&#0032;source&#0032;blazingly&#0032;fast&#0032;url&#0032;shortener&#0032;ever | Product Hunt"
              width={200}
              height={44}
              className='mx-auto cursor-pointer'
            />
        </a>
        <Shorten />
      </div>
    </Layout>
  );
}
