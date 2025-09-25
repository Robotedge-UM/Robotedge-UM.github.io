"use client"

import { LoginForm } from "@/components/auth/login-form"
import { motion } from "framer-motion"
import Image from "next/image"
import { useLandingPageSettings } from "@/lib/hooks/useLandingPageSettings"

export function LoginContent() {
  const { settings } = useLandingPageSettings()

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen py-12 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/10 backdrop-blur-3xl" />
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
      </div>

      {/* Login container */}
      <div className="w-full max-w-md mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 border shadow-xl bg-white/90 backdrop-blur-lg rounded-3xl border-white/40 dark:bg-white/95 dark:border-white/20"
        >
          <div className="mb-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center w-20 h-20 mx-auto"
            >
              <Image
                src={settings?.companyLogo || "/android-chrome-192x192.png"}
                alt={`${settings?.companyName || "ModularMLM"} Logo`}
                width={100}
                height={100}
                className="dark:invert"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text"
            >
              Welcome to {settings?.companyName || "ModularMLM"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-2 text-muted-foreground"
            >
              Sign in to access your dashboard
            </motion.p>
          </div>

          <LoginForm />
        </motion.div>

        {/* Additional animated elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-8 text-sm text-center text-muted-foreground"
        >
          By signing in, you agree to our{" "}
          <a
            href="#"
            className="transition-colors text-primary hover:text-primary-dark"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="transition-colors text-primary hover:text-primary-dark"
          >
            Privacy Policy
          </a>
        </motion.div>
      </div>
    </div>
  )
}
