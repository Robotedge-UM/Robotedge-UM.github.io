import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/hooks/useAuth"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User, Package, CreditCard, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import CompletionStep from "./signup-steps/completion-step"
import PackageSelectionForm from "./signup-steps/package-selection-form"
import PaymentConfirmationForm from "./signup-steps/payment-confirmation-form"
import UserDetailsForm from "./signup-steps/user-details-form"

interface SignupFormProps {
  referralUsername?: string
}

export function SignupForm({ referralUsername }: SignupFormProps) {
  const router = useRouter()
  const { user, register, isLoading, error } = useAuth()

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Referral states
  const [referrerId, setReferrerId] = useState<string | null>(null)
  const [referrerInfo, setReferrerInfo] = useState<{
    firstName: string
    packageType: string
    packageName: string
  } | null>(null)
  const [isLoadingReferrer, setIsLoadingReferrer] = useState(false)
  const [referrerError, setReferrerError] = useState<string | null>(null)

  // Package selection state - now storing packageId
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  // Form validation states
  const [isValidating, setIsValidating] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  const [step, setStep] = useState<
    "details" | "package" | "payment" | "complete"
  >("details")
  // Type for step to fix TypeScript errors
  type StepType = "details" | "package" | "payment" | "complete"

  // Local storage key
  const STORAGE_KEY = "signup_form_data"

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [router, user])

  // Load form data from local storage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)

        // Set form state from saved data
        if (parsedData.firstName) setFirstName(parsedData.firstName)
        if (parsedData.lastName) setLastName(parsedData.lastName)
        if (parsedData.username) setUsername(parsedData.username)
        if (parsedData.email) setEmail(parsedData.email)
        if (parsedData.password) setPassword(parsedData.password)
        if (parsedData.confirmPassword)
          setConfirmPassword(parsedData.confirmPassword)
        if (parsedData.selectedPackage !== undefined)
          setSelectedPackage(parsedData.selectedPackage)
        if (parsedData.step && parsedData.step !== "complete")
          setStep(parsedData.step)
      } catch (error) {
        console.error("Error loading form data from local storage:", error)
      }
    }
  }, [])

  // Save form data to local storage whenever form fields change
  useEffect(() => {
    const formData = {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      selectedPackage,
      step,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
  }, [
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
    selectedPackage,
    step,
  ])

  // Fetch referrer information if referralUsername is provided
  useEffect(() => {
    const fetchReferrer = async () => {
      if (referralUsername) {
        setIsLoadingReferrer(true)
        setReferrerError(null)

        try {
          const response = await fetch(
            `/api/users/by-username/${referralUsername}`
          )

          if (!response.ok) {
            throw new Error("Failed to fetch referrer information")
          }

          const data = await response.json()

          if (data && data.id) {
            setReferrerId(data.id)
            setReferrerInfo({
              firstName: data.firstName || data.username || "User",
              packageType: data.package?.packageType?.name || "Unknown",
              packageName: data.package?.name || "Unknown Package",
            })
          } else {
            setReferrerError("Referrer not found")
          }
        } catch (error) {
          setReferrerError(
            error instanceof Error ? error.message : "Failed to fetch referrer"
          )
          console.error("Error fetching referrer:", error)
        } finally {
          setIsLoadingReferrer(false)
        }
      }
    }

    fetchReferrer()
  }, [referralUsername])

  // Handle MLM signup with payment gateway
  const handleMLMSignup = async (paymentGateway: string) => {
    setPasswordError("")

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (selectedPackage === null) {
      toast.error("Please select a package")
      return
    }

    try {
      // Register user in MLM system with automatic placement
      const result = await register({
        firstName,
        lastName,
        username,
        packageId: selectedPackage,
        email,
        password,
        referrerId: referrerId || undefined,
        paymentGateway, // Pass payment gateway to registration
      })

      // Move to completion step
      setStep("complete")

      // Clear form data from local storage after successful registration
      localStorage.removeItem(STORAGE_KEY)
    } catch (err: any) {
      toast.error(err.message || "Failed to register")
      console.error("Registration error:", err)
    }
  }

  // Validate user details with API
  const validateUserDetails = async (): Promise<boolean> => {
    setIsValidating(true)
    setUsernameError(null)
    setEmailError(null)

    try {
      const response = await fetch("/api/auth/validate-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username }),
      })

      if (!response.ok) {
        throw new Error("Validation request failed")
      }

      const data = await response.json()

      if (data.isEmailTaken) {
        setEmailError("This email is already registered")
        toast.error("This email is already registered")
        return false
      }

      if (data.isUsernameTaken) {
        setUsernameError("This username is already taken")
        toast.error("This username is already taken")
        return false
      }

      return true
    } catch (error) {
      console.error("Error validating user details:", error)
      toast.error("Failed to validate user details. Please try again.")
      return false
    } finally {
      setIsValidating(false)
    }
  }

  // Handle form submission based on current step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === "details") {
      // Validate first step
      if (
        !firstName ||
        !lastName ||
        !username ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        toast.error("Please fill in all required fields")
        return
      }

      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match")
        toast.error("Passwords do not match")
        return
      }

      // Validate with API before proceeding
      const isValid = await validateUserDetails()
      if (isValid) {
        // Move to package selection step
        setStep("package")
      }
    } else if (step === "package") {
      // Validate package selection
      if (!selectedPackage) {
        toast.error("Please select a package")
        return
      }
      // Move to payment step
      setStep("payment")
    } else if (step === "payment") {
      // Process MLM signup
      await handleMLMSignup("dummy") // For now, default to dummy gateway
    }
  }

  // Handle tab change
  const handleTabChange = async (value: string) => {
    // Validate before changing to package tab
    if (value === "package") {
      if (
        !firstName ||
        !lastName ||
        !username ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        toast.error("Please fill in all required fields")
        return
      }

      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match")
        toast.error("Passwords do not match")
        return
      }

      // Validate with API before allowing tab change
      const isValid = await validateUserDetails()
      if (!isValid) {
        return
      }
    }

    // Validate before changing to payment tab
    if (value === "payment") {
      if (!selectedPackage) {
        toast.error("Please select a package first")
        return
      }
    }

    setStep(value as "details" | "package" | "payment")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-5"
    >
      {/* Tabs Navigation */}
      {step !== "complete" && (
        <div className="flex flex-col space-y-6">
          {/* Step Indicator - Horizontal on desktop, vertical on mobile */}
          <div className="w-full">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              {/* Registration Details Step */}
              <div
                className={`flex-1 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  step === "details"
                    ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20"
                    : step === "package" || step === "payment"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange("details")}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step === "details"
                        ? "bg-primary text-white"
                        : step === "package" || step === "payment"
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step === "package" || step === "payment" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm">
                      Registration Details
                    </h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Enter your personal information
                    </p>
                  </div>
                </div>
              </div>

              {/* Package Selection Step */}
              <div
                className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
                  step === "package"
                    ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20 cursor-pointer"
                    : step === "payment"
                      ? "bg-green-50 border-green-200 text-green-700 cursor-pointer"
                      : step === "details"
                        ? "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100 cursor-pointer"
                }`}
                onClick={() => step !== "details" && handleTabChange("package")}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step === "package"
                        ? "bg-primary text-white"
                        : step === "payment"
                          ? "bg-green-500 text-white"
                          : step === "details"
                            ? "bg-gray-300 text-gray-500"
                            : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step === "payment" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Package className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm">Package Selection</h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Choose your MLM package
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment & Confirmation Step */}
              <div
                className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
                  step === "payment"
                    ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20 cursor-pointer"
                    : step === "details" || step === "package"
                      ? "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100 cursor-pointer"
                }`}
                onClick={() => step === "payment" && handleTabChange("payment")}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step === "payment"
                        ? "bg-primary text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm">
                      Payment & Confirmation
                    </h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Complete your registration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            <Tabs
              value={step}
              className="w-full"
            >
              <TabsContent
                value="details"
                className="mt-0"
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <UserDetailsForm
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    username={username}
                    setUsername={setUsername}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    passwordError={passwordError}
                    error={error}
                    usernameError={usernameError}
                    emailError={emailError}
                    referralUsername={referralUsername}
                    isLoadingReferrer={isLoadingReferrer}
                    referrerInfo={referrerInfo}
                    referrerError={referrerError}
                  />

                  {/* Terms and Continue Button for Details Tab */}
                  <div className="space-y-5 mt-5">
                    <div className="flex items-center">
                      <div className="relative flex-shrink-0 w-4 h-4">
                        <input
                          type="checkbox"
                          id="terms"
                          className="absolute w-4 h-4 opacity-0 peer"
                          required
                        />
                        <div className="w-4 h-4 transition-colors border rounded peer-checked:bg-primary peer-checked:border-primary border-muted-foreground/30"></div>
                        <div className="absolute top-0 left-0 flex items-center justify-center w-4 h-4 text-white transition-transform scale-0 peer-checked:scale-100">
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
                      <label
                        htmlFor="terms"
                        className="ml-2 text-sm text-muted-foreground"
                      >
                        I agree to the{" "}
                        <Link
                          href="#"
                          className="transition-colors text-primary hover:text-primary-dark"
                        >
                          Terms of Service
                        </Link>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      variant="gradient"
                      size="lg"
                      rounded
                      isLoading={isLoading || isValidating}
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent
                value="package"
                className="mt-0"
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <PackageSelectionForm
                    selectedPackage={selectedPackage}
                    setSelectedPackage={setSelectedPackage}
                    referrerInfo={referrerInfo}
                  />

                  {/* Continue Button for Package Tab */}
                  <div className="space-y-5 mt-5">
                    <Button
                      type="submit"
                      className="w-full"
                      variant="gradient"
                      size="lg"
                      rounded
                      disabled={!selectedPackage}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent
                value="payment"
                className="mt-0"
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <PaymentConfirmationForm
                    selectedPackage={selectedPackage}
                    referrerInfo={referrerInfo}
                  />

                  {/* Create Account Button for Payment Tab */}
                  <div className="space-y-5 mt-5">
                    <Button
                      type="submit"
                      className="w-full"
                      variant="gradient"
                      size="lg"
                      rounded
                      isLoading={isLoading}
                    >
                      Create Account
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Completion Step (outside of tabs) */}
      {step === "complete" && <CompletionStep router={router} />}

      {/* Sign in link */}
      {step !== "complete" && (
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="transition-colors text-primary hover:text-primary-dark"
          >
            Sign in
          </Link>
        </div>
      )}
    </motion.div>
  )
}
