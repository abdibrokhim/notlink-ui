'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GitFork, LucideStars, Share } from 'lucide-react';
import { Button } from '../ui/button';
import ConnectWallet from '@/components/web3/connect-wallet';

export default function Header() {
  const closeAllDropdowns = () => {
    document.getElementById('forkDropdown')?.classList.add('hidden');
    document.getElementById('starDropdown')?.classList.add('hidden');
  };

  const toggleDropdown = (dropdownId: string) => {
    if (document.getElementById(dropdownId)?.classList.contains('hidden')) {
      closeAllDropdowns();
      document.getElementById(dropdownId)?.classList.remove('hidden');
    } else {
      document.getElementById(dropdownId)?.classList.add('hidden');
    }
  };

  return (
    <header className="border-b border-gray-300 px-4 sm:px-[24px] py-[10px]">
      <div className="mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="https://imcook.in" className="flex items-center space-x-1" target='_blank' rel='noreferrer'>
            <Image src="/assets/oc-logo.svg" alt="oc" width={34} height={34} className='rounded-full' />
          </Link>
          <Image src="/assets/slash.svg" alt="slash" width={22} height={22} className='w-[12px] h-[22px]' />
          <Link href="/" className="flex items-center space-x-1">
            <Image src="/assets/notlink-logo.svg" alt="notlink" width={34} height={34} className='rounded-full' />
          </Link>
        </div>
        <div className='flex flex-row gap-2'>
          <div className="relative">
            <Button 
              onClick={() => toggleDropdown('forkDropdown')}
              variant="secondary"
              className='shrink-0'
            >
              <GitFork className="w-3 h-3" />
              <span className='ml-2 text-xs hidden sm:inline'>Fork</span>
            </Button>
            <div id="forkDropdown" className="hidden absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-100">
              <div className="p-1">
                <a href="https://github.com/abdibrokhim/notlink/fork" target="_blank" rel="noreferrer" className="block px-4 py-2 text-xs text-black hover:text-[#FFFFFF] hover:bg-[#131418]/90 rounded-md transition duration-200">notlink</a>
                <a href="https://github.com/abdibrokhim/notlink-ui/fork" target="_blank" rel="noreferrer" className="block px-4 py-2 text-xs text-black hover:text-[#FFFFFF] hover:bg-[#131418]/90 rounded-md transition duration-200">notlink-ui</a>
              </div>
            </div>
          </div>
          <div className="relative">
            <Button 
              onClick={() => toggleDropdown('starDropdown')}
              variant="secondary"
              className='shrink-0'
            >
              <LucideStars className="w-3 h-3" />
              <span className='ml-2 text-xs hidden sm:inline'>Star</span>
            </Button>
            <div id="starDropdown" className="hidden absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-100">
              <div className="p-1">
                <a href="https://github.com/abdibrokhim/notlink/" target="_blank" rel="noreferrer" className="block px-4 py-2 text-xs text-black hover:text-[#FFFFFF] hover:bg-[#131418]/90 rounded-md transition duration-200">notlink</a>
                <a href="https://github.com/abdibrokhim/notlink-ui/" target="_blank" rel="noreferrer" className="block px-4 py-2 text-xs text-black hover:text-[#FFFFFF] hover:bg-[#131418]/90 rounded-md transition duration-200">notlink-ui</a>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => {
              const text = `try notl.ink - blazingly fast url shortener ever!!`;
              window.open(`https://x.com/intent/post?text=${encodeURIComponent(text)}`, '_blank');
            }}
            variant="secondary"
            className='shrink-0'
          >
            <Share className="w-3 h-3" />
            <span className='ml-2 text-xs hidden sm:inline'>Share</span>
          </Button>
        </div>
        <ConnectWallet />
      </div>
    </header>
  );
}
