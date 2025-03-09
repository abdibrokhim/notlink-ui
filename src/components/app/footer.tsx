'use client'
// import { TextLoop } from '@/components/motion-primitives/text-loop'
import { MoonStar, SparklesIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { SUBSCRIPTION } from '@/lib/constants';

function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleDropdown = (dropdownId: string) => {
    if (document.getElementById(dropdownId)?.classList.contains('hidden')) {
      document.getElementById(dropdownId)?.classList.remove('hidden');
    } else {
      document.getElementById(dropdownId)?.classList.add('hidden');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      className="inline-flex h-7 w-7 items-center justify-center text-black/50 transition-all duration-200 hover:bg-[var(--secondary-darkest)] focus-visible:outline-2 cursor-pointer rounded-md"
      type="button"
      aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
      onClick={() => toggleDropdown('themeDropdown')}
    >
      {/* {theme === 'light' ? <MoonStar className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />} */}
      <MoonStar className="h-4 w-4" />
    </button>
  )
}

export default function Footer() {
  return (
    <div className="border-t border-[var(--secondary-accent)] px-4 sm:px-[24px] py-[10px] fixed bottom-0 w-full">
      <div className="flex items-center justify-between">
        <a className='text-[10px] text-black/50 hover:underline' href="https://yaps.gg" target="_blank" rel='noreferrer noopener'>
            <span>© 2024 YAPS WORLD</span>
        </a>
        <div className="relative text-xs text-black/50">
          <ThemeSwitch />
          <div id="themeDropdown" className="hidden absolute right-0 bottom-0 mb-8 w-28 rounded-md shadow-lg bg-white ring-1 ring-[var(--secondary-accent)] ring-opacity-100 z-10">
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
    </div>
  )
}
