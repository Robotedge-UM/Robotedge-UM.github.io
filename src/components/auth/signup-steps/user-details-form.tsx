import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  AlertTriangle,
  Check,
  Lock,
  Mail,
  User,
} from "lucide-react"

interface UserDetailsFormProps {
  firstName: string
  setFirstName: (value: string) => void
  lastName: string
  setLastName: (value: string) => void
  username: string
  setUsername: (value: string) => void
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
  confirmPassword: string
  setConfirmPassword: (value: string) => void
  passwordError: string
  error: string | null
  usernameError?: string | null
  emailError?: string | null
  referralUsername?: string
  isLoadingReferrer: boolean
  referrerInfo: {
    firstName: string
    packageType: string
    packageName: string
  } | null
  referrerError: string | null
}

const UserDetailsForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  error,
  usernameError,
  emailError,
  referralUsername,
  isLoadingReferrer,
  referrerInfo,
  referrerError,
}: UserDetailsFormProps) => {
  // Input field animation variants
  const inputVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-3">
      <div className="lg:flex lg:space-x-3">
        <motion.div
          className="relative flex-1"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            icon={<User className="w-3.5 h-3.5" />}
            required
          />
        </motion.div>

        <motion.div
          className="relative flex-1"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            icon={<User className="w-3.5 h-3.5" />}
            required
          />
        </motion.div>
      </div>

      <div className="lg:flex lg:space-x-3">
        <motion.div
          className="relative flex-1"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<User className="w-3.5 h-3.5" />}
            error={usernameError || undefined}
            required
          />
        </motion.div>

        <motion.div
          className="relative flex-1"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-3.5 h-3.5" />}
            error={emailError || undefined}
            required
          />
        </motion.div>
      </div>

      <div className="lg:flex lg:space-x-3">
        <motion.div
          className="relative flex-1"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.6 }}
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

        <motion.div
          className="relative flex-1"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-3.5 h-3.5" />}
            error={passwordError || undefined}
            required
          />
        </motion.div>
      </div>

      {passwordError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-2 text-sm rounded-lg text-destructive bg-destructive/10"
        >
          {passwordError}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-2 text-sm rounded-lg text-destructive bg-destructive/10"
        >
          {error}
        </motion.div>
      )}

      {/* No Upline Warning */}
      {!referralUsername && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 mt-3 text-sm border rounded-lg bg-amber-500/10 text-amber-500 border-amber-500/20"
        >
          <div className="flex items-start">
            <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">
                You are signing up without a referral link
              </p>
              <p className="mt-1">
                You will not be under any upline and won't benefit from the
                referral structure. Consider using a referral link to join under
                an existing member.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Referrer Info */}
      {isLoadingReferrer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 mt-3 text-sm rounded-lg bg-primary/10 text-primary"
        >
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-primary animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p>Loading referrer information...</p>
          </div>
        </motion.div>
      )}

      {referrerInfo && !isLoadingReferrer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 mt-3 text-sm border rounded-lg bg-success/10 text-success border-success/20"
        >
          <div className="flex items-start">
            <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">
                You are signing up under {referrerInfo.firstName}
              </p>
              <p className="mt-1 text-success/80">
                Package: {referrerInfo.packageName}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {referrerError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 mt-3 text-sm border rounded-lg bg-destructive/10 text-destructive border-destructive/20"
        >
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <p>Error: {referrerError}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default UserDetailsForm
