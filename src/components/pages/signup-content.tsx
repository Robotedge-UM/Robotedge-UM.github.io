"use client"

import { SignupForm } from "@/components/auth/signup-form"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface SignupContentProps {
  referralUsername?: string
}

export function SignupContent({ referralUsername }: SignupContentProps) {
  return (
    <div className="relative flex items-center justify-center w-full min-h-screen py-12 overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/10 backdrop-blur-3xl" />

        {/* Primary blob */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-64 h-64 rounded-full top-1/4 -left-32 bg-primary/30 blur-3xl"
        />

        {/* Secondary blob */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
          className="absolute w-64 h-64 rounded-full bottom-1/4 -right-32 bg-secondary/30 blur-3xl"
        />

        {/* Additional animated elements */}
        <motion.div
          animate={{
            y: [0, 30, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-40 h-40 rounded-full top-1/3 right-1/4 bg-primary/20 blur-2xl"
        />

        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute w-32 h-32 rounded-full bottom-1/3 left-1/4 bg-secondary/20 blur-2xl"
        />

        {/* Floating particles */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [
                  Math.random() * 100 + "%",
                  Math.random() * 100 + "%",
                  Math.random() * 100 + "%",
                ],
              }}
              transition={{
                duration: Math.random() * 10 + 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.3)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced signup container */}
      <div className="w-full max-w-xl mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative p-8 overflow-hidden border shadow-xl bg-white/90 backdrop-blur-lg rounded-3xl border-white/40 dark:bg-white/95 dark:border-white/20"
        >
          {/* Glassmorphic shine effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
            <div
              className="absolute -inset-[100%] animate-[spin_25s_linear_infinite] opacity-30"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, transparent 0%, white 25%, transparent 50%)",
              }}
            ></div>
          </div>

          {/* Content with relative positioning to appear above the effects */}
          <div className="relative">
            <div className="mb-8 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative flex items-center justify-center w-24 h-24 mx-auto"
              >
                <Image
                  src="/android-chrome-192x192.png"
                  alt="Robotedge Logo"
                  width={100}
                  height={100}
                  className="dark:invert"
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-3xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text"
              >
                Join Robotedge
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-2 text-muted-foreground"
              >
                {referralUsername
                  ? `Join through ${referralUsername}'s referral and get optimal binary placement`
                  : "Create your account and start building your network marketing business"}
              </motion.p>
            </div>
            <SignupForm referralUsername={referralUsername} />
          </div>
        </motion.div>

        {/* Enhanced footer with glassmorphic effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative p-4 mt-8 overflow-hidden border shadow-lg rounded-xl border-white/10 backdrop-blur-md bg-white/5"
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

          <p className="relative text-sm text-center text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link
              href="#"
              className="transition-colors text-primary hover:text-primary-dark"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="transition-colors text-primary hover:text-primary-dark"
            >
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
