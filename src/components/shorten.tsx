"use client"

import Image from 'next/image';
import React, { useEffect, useRef } from "react"
import { X, ArrowRightIcon, CopyIcon, ArrowDown, LockKeyholeIcon, LockKeyholeOpen, CheckCheckIcon, LucideStars } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { loader } from "@/lib/getLoader"
import { getOnLoadCodeList } from "@/lib/getOnLoadCodeList"
import { ShortURLResponse, WalletResponse } from "./types"
import { Turnstile } from "next-turnstile";

type TurnstileStatus = "required" | "success" | "error" | "expired";

export default function Shorten() {
  const [loading, setLoading] = useState(false);
  const [longURL, setLongURL] = useState("");
  const [onShorten, setOnShorten] = useState(false);
  const [onCopy, setOnCopy] = useState(false);
  const onLoadCodeList: string[] = getOnLoadCodeList();
  const shortCode = onLoadCodeList[0];
  const domainName = `https://${process.env.DOMAIN_NAME}`;
  const [shortenedURL, setShortenedURL] = useState<string | null>(null);
  const [encrypted, setEncrypted] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>("required");
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileKey, setTurnstileKey] = useState(Date.now());
  
  // Add a ref to the Turnstile component
  // const turnstileRef = useRef<any>(null);

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
      setShortenedURL(`${domainName}/${data.short_code}`);
      // Reset Turnstile after successful submission
      // After each submission, update the key to force a remount:
      setTurnstileKey(Date.now());
      setTurnstileToken("");
      setTurnstileStatus("required");
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      // Ensure Turnstile is reset even if there's an error
      // After each submission, update the key to force a remount:
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

        <a 
          className="flex mx-auto items-center justify-center absolute -top-[200px] right-0 left-0"
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

        <h1 className="text-xl md:text-2xl text-center">
          a new kind of url shortener
        </h1>
      <div className="">

        <div className="relative max-w-2xl">
          <Input
            type="text"
            placeholder="Shorten a URL"
            className="w-full pl-12 pr-12 py-3 text-lg border-gray-200 rounded-full bg-white outline-none shadow-sm"
            value={longURL}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-2">
            {longURL && (
              <Button
                variant="ghost"
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
                const starRepo = localStorage.getItem('starRepo') === 'true';
                if (!starRepo) {
                  toggleDropdown('starDropdownInput');
                } else {
                  handleEncrypt(!encrypted);
                }
              }
              }
              >
              {encrypted 
              ? <LockKeyholeIcon className="h-4 w-4" />
              : <LockKeyholeOpen className="h-4 w-4" />}
            </Button>
          </div>
          <div id="starDropdownInput" className="hidden absolute left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-100">
              <div className="p-1 flex flex-col gap-1 items-center">
                <p className="text-sm">⭐️ Star us on Github ⭐️</p>
                <div className="flex flex-row gap-2 mt-2">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-9 w-16 text-xs"
                    onClick={() => {
                      window.open('https://github.com/abdibrokhim/notlink/', '_blank');
                    }}
                  >
                    <LucideStars className="w-3 h-3" />
                    <span className='ml-2 text-xs hidden sm:inline'>Star</span>
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-9 w-16 text-xs"
                    onClick={() => 
                    {
                      localStorage.setItem('starRepo', 'true');
                      localStorage.setItem('starredAt', new Date().toISOString());
                      toggleDropdown('starDropdownInput');
                    }
                    }
                  >
                    <CheckCheckIcon className="w-3 h-3" />
                    <span className='ml-2 text-xs hidden sm:inline'>Done</span>
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
                    {loading ? loader() :
                      <ArrowDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="">
              {shortenedURL && (
                <div className="relative max-w-xs mx-auto">
                  <Input
                    type="text"
                    value={shortenedURL}
                    readOnly
                    className="w-full pl-6 pr-12 py-3 text-sm border-gray-300 rounded-full bg-white outline-none shadow-sm"
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-2">
                    <Button 
                      variant="default" 
                      size="icon" 
                      className="h-10 w-10"
                      onClick={() => {
                        navigator.clipboard.writeText(shortenedURL);
                        setOnCopy(true);
                        setTimeout(() => {
                          setOnCopy(false);
                        }, 1000);
                      }}
                    >
                      {loading ? loader() :
                        onCopy 
                          ? <CheckCheckIcon className="h-4 w-4" />
                          : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
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
