"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface AnimatedCodeListProps {
  words: string[]
}

export function AnimatedCodeList({ words }: AnimatedCodeListProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length)
        setIsVisible(true)
      }, 500)
    }, 500)

    return () => clearInterval(interval)
  }, [words.length])

  return (
    <div className="flex mt-8 items-center justify-center min-h-[4rem]">
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentIndex}
            initial={{
              opacity: 0,
              y: 20,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -20,
              filter: "blur(10px)",
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="text-md md:text-lg font-medium text-gray-800"
          >
            {words[currentIndex]}
          </motion.h2>
        </AnimatePresence>
      </div>
    </div>
  )
}
