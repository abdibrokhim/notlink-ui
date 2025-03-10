'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GitFork, LucideStars, Share, Menu, ExternalLinkIcon, CoffeeIcon, MailIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { SUBSCRIPTION } from '@/lib/constants';

export default function Header() {
  const closeAllDropdowns = () => {
    document.getElementById('forkDropdown')?.classList.add('hidden');
  };

  const toggleDropdown = (dropdownId: string) => {
    if (document.getElementById(dropdownId)?.classList.contains('hidden')) {
      closeAllDropdowns();
      document.getElementById(dropdownId)?.classList.remove('hidden');
    } else {
      document.getElementById(dropdownId)?.classList.add('hidden');
    }
  };

  // Toggle the mobile menu dropdown
  const toggleMobileMenu = () => {
    toggleDropdown('menuDropdown');
  };

  const [activeTab, setActiveTab] = useState('fork');

  // Data structure for links
  const links: any = {
    fork: [
      { label: 'notlink', url: 'https://github.com/abdibrokhim/notlink/fork' },
      { label: 'notlink-ui', url: 'https://github.com/abdibrokhim/notlink-ui/fork' }
    ],
    star: [
      { label: 'notlink', url: 'https://github.com/abdibrokhim/notlink/' },
      { label: 'notlink-ui', url: 'https://github.com/abdibrokhim/notlink-ui/' }
    ]
  };

  return (
    <header className="border-b border-[var(--secondary-accent)] px-4 sm:px-[24px] py-[10px] relative top-0 sticky z-50">
      <div className="mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="https://yaps.gg" className="flex items-center space-x-1" target="_blank" rel="noreferrer">
            <Image src="/assets/yapsdotgg.svg" alt="yapsdotgg" width={34} height={34} className="rounded-full" />
          </Link>
          <Image src="/assets/slash.svg" alt="slash" width={22} height={22} className="w-[12px] h-[22px]" />
          <Link href="/" className="flex items-center space-x-1">
            <Image src="/assets/notlink.svg" alt="notlink" width={34} height={34} className="rounded-full" />
          </Link>
        </div>
        <div className="flex gap-2">
          <div className="">
            <Button onClick={toggleMobileMenu} variant="secondary" className="">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div 
        id="menuDropdown"
        className="hidden absolute right-4 sm:right-[24px] mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-[var(--secondary-accent)] ring-opacity-100 z-10"
      >
        <div className="p-2 space-y-2">
          <div className="flex gap-2 items-center justify-between w-full rounded-md">
            {['fork', 'star'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant="ghost"
                size="sm"
                className={`w-1/2 font-medium text-sm px-4 py-1 rounded-md transition duration-200 transform ${
                  activeTab === tab
                    ? 'text-white bg-[#44403C]/90 scale-105'
                    : 'text-black scale-100'
                }`}
              >
                {tab === 'fork' ? <GitFork className="w-3 h-3" /> : <LucideStars className="w-3 h-3" />}
                <span className="ml-2 text-sm">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </Button>
            ))}
          </div>
          <div className="flex flex-col mt-2 gap-1">
            {links[activeTab].map((item: any) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between block px-4 py-1 text-sm text-black hover:text-white hover:bg-[#44403C]/90 rounded-md transition duration-200 transform hover:scale-102"
              >
                <span>{item.label}</span>
                <ExternalLinkIcon className="w-3 h-3" />
              </a>
            ))}
          </div>
          <div className='h-[.5px] bg-[var(--secondary-darkest)]'></div>
          <div className='flex flex-row space-x-1 items-center justify-between w-full'>
            <Button 
              onClick={() => {
                const text = `try notl.ink - blazingly fast url shortener ever!!`;
                window.open(`https://x.com/intent/post?text=${encodeURIComponent(text)}`, '_blank');
              }}
              variant="outline"
              size="sm"
              className="justify-center mr-0 w-1/2"
            >
              <Share className="w-3 h-3" />
              <span className="ml-2 text-sm">Share</span>
            </Button>
            <Button 
              onClick={() => {
                window.open(`https://opencollective.com/opencommunity`, '_blank');
              }}
              variant="outline"
              size="sm"
              className="justify-center mr-0 w-1/2"
            >
              <CoffeeIcon className="w-3 h-3" />
              <span className="ml-2 text-sm">Donate</span>
            </Button>
          </div>
          <div className='h-[.5px] bg-[var(--secondary-darkest)]'></div>
          <div className=''>
            <a 
              href="https://www.producthunt.com/posts/notlink?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-notlink" 
              target="_blank"
              className="flex mx-auto items-center justify-center hover:opacity-80"
              >
                <Image 
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=886596&theme=light&t=1739803124250"
                  alt="notlink - open&#0032;source&#0032;blazingly&#0032;fast&#0032;url&#0032;shortener&#0032;ever | Product Hunt"
                  width={170}
                  height={30}
                  className='mx-auto cursor-pointer'
                />
            </a>
          </div>
          <div>
            <a 
              href="https://www.producthunt.com/products/notlink/reviews?utm_source=badge-product_rating&utm_medium=badge&utm_souce=badge-notlink" 
              target="_blank"
              className='flex mx-auto items-center justify-center hover:opacity-80'
              >
                <Image 
                  src="https://api.producthunt.com/widgets/embed-image/v1/product_rating.svg?product_id=992403&theme=light" 
                  alt="notlink - open&#0032;source&#0032;blazingly&#0032;fast&#0032;url&#0032;shortener&#0032;ever | Product Hunt" 
                  width={170}
                  height={30}
                  className='mx-auto cursor-pointer'
                />
            </a>
          </div>
          <div className='h-[.5px] bg-[var(--secondary-darkest)]'></div>
          <div className='flex flex-row space-x-1 items-center justify-between w-full'>
            <div className='text-sm w-1/2'>Enterprise?</div>
            <Button
              onClick={() => {
                window.open('mailto:abdibrokhim@gmail.com?subject=Enterprise%20Inquiry', '_blank')
              }}
              variant="secondary" 
              size="sm"
              className="w-1/2 justify-center"
            >
              <MailIcon className="w-3 h-3 text-white" />
              <span className="ml-2 text-sm">Contact</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
