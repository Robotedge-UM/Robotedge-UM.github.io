import { Metadata } from "next"
import { HomeContentEditor } from "@/components/admin/home-content-editor"

export const metadata: Metadata = {
  title: "Home Content Management - Admin",
  description:
    "Manage home page content including hero, about, research areas, and news",
}

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Home Content Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage all sections of the home page including hero, about, research
            areas, and news & events.
          </p>
        </div>

        <HomeContentEditor />
      </div>
    </div>
  )
}
