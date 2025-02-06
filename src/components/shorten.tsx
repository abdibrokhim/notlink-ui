"use client"

import React from "react"
import { X, ArrowRightIcon, CopyIcon, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { loader } from "@/lib/getLoader"
import { getOnLoadCodeList } from "@/lib/getOnLoadCodeList"
import { ShortURLResponse, WalletResponse } from "./types"

export default function Shorten() {
  const [loading, setLoading] = useState(false);
  const [longURL, setLongURL] = useState("");
  const [onShorten, setOnShorten] = useState(false);
  const onLoadCodeList: string[] = getOnLoadCodeList();
  const shortCode = onLoadCodeList[0];
  const shortUrl = "https://notl.ink";
  const [shortenedURL, setShortenedURL] = useState<string | null>(null);
  const [encrypted, setEncrypted] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.target.value.trim();
  
    // 1. Early return if length is too large
    if (val.length > 200) {
      console.log('length exceeded');
      return;
    }
  
    // 2. Disallow curly and square brackets
    if (/[{}\[\]]/.test(val)) {
      console.log('invalid character');
      return;
    }
  
    // 3. Remove query string or fragment (anything after ? or #)
    val = val.replace(/[?#].*$/, '');
  
    // 4. Validate as a URL
    try {
      // If user might omit protocol, prepend it
      if (!/^https?:\/\//i.test(val)) {
        val = 'https://' + val;
      }
  
      // Construct to ensure it's a valid URL
      const parsed = new URL(val);

      // Validate URL has proper domain structure
      if (!parsed.hostname.includes('.') || parsed.hostname.length < 3) {
        console.log('invalid domain');
        return;
      }

      // Clean the URL
      val = parsed.origin + parsed.pathname;
    } catch (error) {
      console.log('invalid URL');
      return;
    }
  
    // 5. If the final, stripped URL is still too long
    if (val.length > 200) {
      console.log('length exceeded');
      return;
    }
  
    // 6. All good, set the URL
    console.log('valid URL: ', val);
    setLongURL(val);
  }

  async function handleShorten(val: string) {

    if (val.length === 0) {
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
          transaction_hash: transactionHash
        }),
      });
      const data: ShortURLResponse = await response.json();
      console.log('Response', data);
      setShortenedURL(`${shortUrl}/${data.short_code}`);
    } catch (error) {
      console.error('Error:', error);
    } 
    setLoading(false);
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

  const handleEncrypt = () => {
    setEncrypted(false);
  };

  const handleTransactionHash = () => {
    setTransactionHash(null);
  };

  return (
    <div className="max-w-2xl w-full space-y-4 px-4 md:px-0">
        <h1 className="text-xl md:text-2xl text-center">
          a new kind of url shortener
        </h1>
      <div className="">

        <div className="relative max-w-2xl">
          <Input
            type="text"
            placeholder="Shorten a URL"
            className="w-full pl-6 pr-12 py-3 text-lg border-gray-300 rounded-full bg-white outline-none shadow-sm"
            value={longURL}
            onChange={handleChange}
            onKeyDown={handleKeyDown} // Add the key down handler
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
                      onClick={() => 
                        navigator.clipboard.writeText(shortenedURL)
                      }
                    >
                      {loading ? loader() :
                        <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
