"use client"

import Image from 'next/image';
import React, { useEffect, useRef } from "react"
import { X, ArrowRightIcon, CopyIcon, ArrowDown, LockKeyholeIcon, LockKeyholeOpen, CheckCheckIcon, LucideStars, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { loader } from "@/lib/getLoader"
import { ShortURLResponse, WalletResponse } from "./types"
import { Turnstile } from "next-turnstile";
import { rollShortCodeAnimation, AnimatedShortCode } from "@/components/code-anima";
import { SUBSCRIPTION } from '@/lib/constants';

type TurnstileStatus = "required" | "success" | "error" | "expired";

export default function Shorten() {
  const [loading, setLoading] = useState(false);
  const [longURL, setLongURL] = useState("");
  const [onShorten, setOnShorten] = useState(false);
  const [onCopy, setOnCopy] = useState(false);
  const domainName = `https://${process.env.DOMAIN_NAME}`;
  const [shortenedURL, setShortenedURL] = useState<string | null>(null);
  const [encrypted, setEncrypted] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>("required");
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileKey, setTurnstileKey] = useState(Date.now());

  const initialCode = "------";
  const [displayedCode, setDisplayedCode] = useState(initialCode);
  const animationControllerRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const starredAt = localStorage.getItem('starredAt');
    if (starredAt) {
      const oneDay = 24 * 60 * 60 * 1000;
      const diff = new Date().getTime() - new Date(starredAt).getTime();
      if (diff > oneDay) {
        localStorage.setItem('starRepo', 'false');
      }
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.target.value.trim();
  
    // 1. Early return if length is too large
    if (val.length > 200) {
      console.log('length exceeded');
      return;
    }
  
    // 2. Disallow braces, brackets, invisible unicode, etc.
    if (/[{}\[\]\u200B-\u200D\uFEFF]/.test(val)) {
      console.log('invalid character');
      return;
    }
  
    // 3. Remove anything after ? or # if you do not allow queries/fragments
    val = val.replace(/[?#].*$/, '');
  
    // 4. Ensure protocol is present; default to https if missing
    if (!/^https?:\/\//i.test(val)) {
      val = 'https://' + val;
    }
  
    try {
      const parsed = new URL(val);
  
      // 5. Restrict protocols to only https (optional)
      if (parsed.protocol !== 'https:') {
        console.log('only HTTPS allowed');
        return;
      }
  
      // 6. Check ports (optional)
      if (parsed.port && !['80', '443'].includes(parsed.port)) {
        console.log('invalid or unsupported port');
        return;
      }
  
      // 7. Block local or private IP ranges
      // (You can do more advanced checking or IP resolution server-side)
      const hostname = parsed.hostname;
      if (
        hostname === 'localhost' ||
        /^127\.\d+\.\d+\.\d+$/.test(hostname) ||
        /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
        /^192\.168\.\d+\.\d+$/.test(hostname) ||
        hostname.endsWith('.localhost') ||
        // And so on for other private ranges...
        hostname.includes('::1')
      ) {
        console.log('private/localhost not allowed');
        return;
      }
  
      // 8. Check for suspicious patterns or direct IP addresses
      if (
        hostname.match(/^(\d{1,3}\.){3}\d{1,3}$/) || // IPv4
        hostname.includes('0x') || // Hex IP
        hostname.match(/[^a-zA-Z0-9.-]/) // Non-standard chars
      ) {
        console.log('suspicious hostname pattern');
        return;
      }
  
      // 9. Ensure there's a dot in the hostname (basic public domain check)
      if (!hostname.includes('.') || hostname.length < 3) {
        console.log('invalid domain');
        return;
      }

      // Block own domain
      if (parsed.hostname === process.env.DOMAIN_NAME || parsed.hostname === `www.${process.env.DOMAIN_NAME}`) {
        console.log('cannot shorten own domain');
        return;
      }
  
      // 10. Final cleaning: reconstruct the allowed final URL
      val = parsed.origin + parsed.pathname;
    } catch (error) {
      console.log('invalid URL');
      return;
    }
  
    // 11. Final length check
    if (val.length > 200) {
      console.log('length exceeded');
      return;
    }
  
    // 12. Success
    console.log('valid URL: ', val);
    setLongURL(val);
  }

  async function handleShorten(val: string) {

    if (val.length === 0) {
      return;
    }

    if (turnstileStatus !== "success") {
      setTurnstileError("Please verify you are not a robot first.");
      return;
    }

    setOnShorten(true);
    setLoading(true);

    animationControllerRef.current = rollShortCodeAnimation(setDisplayedCode, 200, 0.9, 50);

    try {
      const response = await fetch(`/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          long_url: val,
          encrypted: encrypted,
          transaction_hash: transactionHash,
          turnstile_token: turnstileToken,
        }),
      });
      const data: ShortURLResponse = await response.json();
      console.log('Response', data);

      if (animationControllerRef.current) {
        animationControllerRef.current.stop();
        animationControllerRef.current = null;
      }

      setShortenedURL(`${domainName}/${data.short_code}`);
      
      setTurnstileKey(Date.now());
      setTurnstileToken("");
      setTurnstileStatus("required");
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);

      if (animationControllerRef.current) {
        animationControllerRef.current.stop();
        animationControllerRef.current = null;
      }

      setTurnstileKey(Date.now());
      setTurnstileToken("");
      setTurnstileStatus("required");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && e.metaKey) {
      // Clear input on Command + Backspace
      setLongURL("");
    }
    if (e.key === 'Backspace' && e.ctrlKey) {
      // Clear input on Ctrl + Backspace
      setLongURL("");
    }
  };

  const handleEncrypt = (val: boolean) => {
    console.log("Encrypt:", val);
    setEncrypted(val);
  };

  const handleTransactionHash = () => {
    setTransactionHash(null);
  };

  const toggleDropdown = (dropdownId: string) => {
    if (document.getElementById(dropdownId)?.classList.contains('hidden')) {
      document.getElementById(dropdownId)?.classList.remove('hidden');
    } else {
      document.getElementById(dropdownId)?.classList.add('hidden');
    }
  };

  return (
    <div className="relative max-w-2xl w-full space-y-4 px-4 md:px-0">

        <h1 className="text-xl md:text-2xl text-center">
          a new kind of url shortener
        </h1>
      <div className="">

        <div className="relative max-w-2xl">
          {/* <div className="relative"> */}
            {/* Animated long URL display as a background overlay */}
            {/* <div className="absolute inset-0 flex items-center pl-12 pr-12 text-lg text-gray-700 pointer-events-none bg-white rounded-full border border-[var(--secondary-accent)] shadow-sm overflow-hidden">
              <div className="whitespace-nowrap overflow-x-auto">
                <AnimatedShortCode finalCode={longURL} />
              </div>
            </div> */}
            {/* Transparent input over the animated text */}
            {/* <Input
              type="text"
              placeholder="Shorten a URL"
              className="w-full pl-12 pr-12 py-3 text-lg border-[var(--secondary-accent)] rounded-full bg-transparent outline-none shadow-sm relative"
              value={longURL}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            /> */}
          {/* </div> */}
          <Input
            type="text"
            placeholder="Shorten a URL"
            className="w-full pl-12 pr-12 py-3 text-lg border-[var(--secondary-accent)] rounded-full bg-white outline-none shadow-sm"
            value={longURL}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-2">
            {longURL && (
              <Button
                variant="link"
                size="icon"
                className="h-10 w-10 text-stone-400 hover:text-stone-600 focus:outline-none flex items-center justify-center"
                onClick={
                  () => {
                    setLongURL("");
                  }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="default" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => handleShorten(longURL)}
              >
              {loading ? loader() :
              <ArrowRightIcon className="h-4 w-4" />}
            </Button>
          </div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 flex gap-2">
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => 
              {
                // const starRepo = localStorage.getItem('starRepo') === 'true';
                // if (!starRepo) {
                  toggleDropdown('subDropdown');
                // } else {
                  // handleEncrypt(!encrypted);
                // }
              }
              }
              >
              {encrypted 
              ? <LockKeyholeIcon className="h-4 w-4" />
              : <LockKeyholeOpen className="h-4 w-4" />}
            </Button>
          </div>
          {/* star repo dropdown */}
          <div id="starDropdownInput" className="hidden absolute left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-[var(--secondary-accent)] ring-opacity-100 z-10">
            <div className="p-1 space-y-2 flex flex-col gap-1 items-center">
              <p className="text-sm font-medium">click <span className='underline'>star</span> then <span className='underline'>done</span></p>
              <div className="flex flex-col gap-1 mt-2 w-full">
                <Button 
                  variant="secondary" 
                  className="h-8 w-full text-xs"
                  onClick={() => {
                    window.open('https://github.com/abdibrokhim/notlink/', '_blank');
                  }}
                >
                  <LucideStars className="w-3 h-3" />
                  <span className='ml-2 text-xs inline'>Star</span>
                </Button>
                <Button 
                  variant="secondary" 
                  className="h-8 w-full text-xs"
                  onClick={() => 
                  {
                    localStorage.setItem('starRepo', 'true');
                    localStorage.setItem('starredAt', new Date().toISOString());
                    toggleDropdown('starDropdownInput');
                  }
                  }
                >
                  <CheckCheckIcon className="w-3 h-3" />
                  <span className='ml-2 text-xs inline'>Done</span>
                </Button>
              </div>
            </div>
          </div>
          {/* Subscription */}
          <div id="subDropdown" className="hidden absolute left-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-[var(--secondary-accent)] ring-opacity-100 z-10">
            <div className="p-1 space-y-2 flex flex-col gap-1 items-center">
              <p className="text-xs font-medium">upgrade to pro</p>
              <div className="flex flex-col gap-1 mt-2 w-full">
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="h-8 w-full text-xs"
                  onClick={() => {
                    window.open(SUBSCRIPTION, '_blank')
                  }}
                >
                  <SparklesIcon className="w-3 h-3" />
                  <span className='mx-2 text-xs inline'>Pro</span>
                  <SparklesIcon className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-[4rem]">
        {!onShorten ? (
          null
        ) : (
          <div className="flex flex-col gap-4">
            <div className="">
              <div className="relative max-w-2xl">
                <div className="absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 cursor-text"
                    onClick={() => {}}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="">
              <div className="relative max-w-xs mx-auto">
                {loading ? (
                  <Input
                    type="text"
                    value={`${domainName}/${displayedCode}`}
                    readOnly
                    className="w-full pl-6 pr-12 py-3 text-sm border-[var(--secondary-accent)] rounded-full bg-white outline-none shadow-sm"
                  />
                ) : (
                  <div className="flex h-12 border border-[var(--secondary-accent)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm md:placeholder:text-md placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 outline-none w-full pl-6 pr-12 py-3 rounded-full bg-white">
                    {domainName}/<AnimatedShortCode finalCode={displayedCode} />
                  </div>
                )}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-2">
                  <Button 
                    variant="default" 
                    size="icon" 
                    className="h-10 w-10"
                    onClick={() => {
                      if (!loading && shortenedURL) {
                        navigator.clipboard.writeText(shortenedURL);
                        setOnCopy(true);
                        setTimeout(() => setOnCopy(false), 1000);
                      }
                    }}
                    disabled={loading || !shortenedURL}
                  >
                    {onCopy 
                      ? <CheckCheckIcon className="h-4 w-4" />
                      : <CopyIcon className="h-4 w-4" />
                    }
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <Turnstile
          key={turnstileKey}
          siteKey={process.env.TURNSTILE_SITE_KEY!}
          retry="auto"
          refreshExpired="auto"
          sandbox={process.env.WHICH_NODE_ENV === "development"}
          onError={() => {
            setTurnstileStatus("error");
            setTurnstileError("Security check failed. Please try again.");
            setTurnstileToken(""); // Clear expired token
          }}
          onExpire={() => {
            setTurnstileStatus("expired");
            setTurnstileError("Security check expired. Please verify again.");
            setTurnstileToken(""); // Clear expired token
          }}
          onLoad={() => {
            setTurnstileStatus("required");
            setTurnstileError(null);
          }}
          onVerify={(token) => {
            setTurnstileStatus("success");
            setTurnstileError(null);
            setTurnstileToken(token);
          }}
        />
        {turnstileError && (
          <div className="text-red-500 text-sm mt-2" aria-live="polite">
            {turnstileError}
          </div>
        )}
      </div>
    </div>
  )
}
