import { LoginContent } from "@/components/pages/login-content"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - Robotedge",
  description:
    "Sign in to access your Robotedge dashboard and manage your binary tree referral network.",
}

export default function LoginPage() {
  return <LoginContent />
}
