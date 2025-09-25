"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Users, DollarSign } from "lucide-react"

export function SystemSettingsContent() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center space-x-4">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Manage your Robotedge system configuration
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              User Management
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active Users</div>
            <p className="text-xs text-muted-foreground">
              Manage user accounts and permissions
            </p>
            <Badge
              variant="secondary"
              className="mt-2"
            >
              Database-driven
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bonus Settings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bonus System</div>
            <p className="text-xs text-muted-foreground">
              Configure bonus rates and distribution
            </p>
            <Badge
              variant="secondary"
              className="mt-2"
            >
              Automated
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Operational</div>
            <p className="text-xs text-muted-foreground">
              All systems running normally
            </p>
            <Badge
              variant="default"
              className="mt-2"
            >
              Online
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">System Information</h2>
        <Card>
          <CardHeader>
            <CardTitle>Platform Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium">Database System</h3>
                <p className="text-sm text-muted-foreground">
                  PostgreSQL with Prisma ORM for reliable data management
                </p>
              </div>
              <div>
                <h3 className="font-medium">Bonus Distribution</h3>
                <p className="text-sm text-muted-foreground">
                  Automated bonus calculations and distribution system
                </p>
              </div>
              <div>
                <h3 className="font-medium">User Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Secure JWT-based authentication and authorization
                </p>
              </div>
              <div>
                <h3 className="font-medium">Package System</h3>
                <p className="text-sm text-muted-foreground">
                  Multiple tier packages with different bonus structures
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
