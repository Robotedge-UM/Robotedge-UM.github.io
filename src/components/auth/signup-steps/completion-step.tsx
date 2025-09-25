import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface CompletionStepProps {
  router: AppRouterInstance
}

const CompletionStep = ({ router }: CompletionStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 text-center"
    >
      <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-success/20">
        <Check className="w-10 h-10 text-success" />
      </div>

      <div>
        <h3 className="mb-2 text-xl font-bold text-foreground">
          Registration Successful!
        </h3>
        <p className="text-sm text-muted-foreground">
          You have successfully joined our MLM program
        </p>
      </div>

      <div className="p-4 text-left border rounded-lg bg-success/10 backdrop-blur-sm border-success/20">
        <p className="mb-1 font-medium text-success">Welcome to the Program!</p>
        <p className="text-sm text-success/80">
          Your account has been created and you can now access your dashboard to
          start building your network.
        </p>
      </div>

      <Button
        type="button"
        className="w-full"
        variant="gradient"
        size="lg"
        rounded
        onClick={() => router.push("/dashboard")}
      >
        Go to Dashboard
      </Button>
    </motion.div>
  )
}

export default CompletionStep
