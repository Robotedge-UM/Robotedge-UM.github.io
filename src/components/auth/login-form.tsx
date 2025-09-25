import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/hooks/useAuth"
import { motion } from "framer-motion"
import { Lock, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading, error, user } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [router, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login({ username, password })
      router.push("/dashboard")
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  // Input field animation variants
  const inputVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-6"
    >
      <div className="space-y-4">
        <motion.div
          className="relative"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<User className="w-3.5 h-3.5" />}
            required
          />
        </motion.div>

        <motion.div
          className="relative"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-3.5 h-3.5" />}
            required
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-sm text-destructive bg-destructive/10 p-2 rounded-lg"
          >
            {error}
          </motion.div>
        )}
      </div>

      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label className="flex items-center space-x-2 group">
          <div className="relative w-4 h-4">
            <input
              type="checkbox"
              className="absolute w-4 h-4 opacity-0 peer"
            />
            <div className="w-4 h-4 border rounded transition-colors peer-checked:bg-primary peer-checked:border-primary border-muted-foreground/30"></div>
            <div className="absolute top-0 left-0 w-4 h-4 scale-0 transition-transform peer-checked:scale-100 flex items-center justify-center text-white">
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 1L3.5 6.5L1 4"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Remember me
          </span>
        </label>
        <motion.a
          href="#"
          className="text-sm text-primary hover:text-primary-dark transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Forgot password?
        </motion.a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          type="submit"
          className="w-full"
          variant="gradient"
          size="lg"
          rounded
          isLoading={isLoading}
        >
          Sign in
        </Button>
      </motion.div>

      <motion.div
        className="text-sm text-center text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-primary hover:text-primary-dark transition-colors"
        >
          Sign up
        </Link>
      </motion.div>
    </motion.form>
  )
}
