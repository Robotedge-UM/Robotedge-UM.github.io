import { CustomizableFaqsContent } from "@/components/pages/customizable-faqs-content"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQs - ModularMLM",
  description:
    "Frequently asked questions about our MLM platform, packages, bonuses, and getting started.",
}

export default function FaqsPage() {
  return <CustomizableFaqsContent />
}
