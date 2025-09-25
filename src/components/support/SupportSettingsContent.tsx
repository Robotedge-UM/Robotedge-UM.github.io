"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Clock, Save } from "lucide-react"
import { toast } from "react-toastify"

type SupportSettings = {
  id: string
  criticalResponseTarget: number
  highResponseTarget: number
  mediumResponseTarget: number
  lowResponseTarget: number
  autoEscalateAfter: number
  enableAutoAssignment: boolean
  autoSuggestKnowledgeBase: boolean
}

export function SupportSettingsContent() {
  const [settings, setSettings] = useState<SupportSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/support/settings")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching support settings:", error)
      toast.error("Failed to load support settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/support/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error("Failed to save settings")
      toast.success("Support settings have been saved")
    } catch (error) {
      console.error("Error saving support settings:", error)
      toast.error("Failed to save support settings")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Failed to load settings
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Response Time Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Response Time Targets</CardTitle>
          <CardDescription>
            Set target response times for different ticket priority levels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="criticalResponse">
                Critical Priority Response (hours)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="criticalResponse"
                  type="number"
                  min="0"
                  step="0.5"
                  value={settings.criticalResponseTarget}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      criticalResponseTarget: parseFloat(e.target.value),
                    })
                  }
                />
                <Badge
                  variant="destructive"
                  className="w-20 justify-center"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {settings.criticalResponseTarget}h
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="highResponse">
                High Priority Response (hours)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="highResponse"
                  type="number"
                  min="0"
                  step="0.5"
                  value={settings.highResponseTarget}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      highResponseTarget: parseFloat(e.target.value),
                    })
                  }
                />
                <Badge
                  variant="warning"
                  className="w-20 justify-center"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {settings.highResponseTarget}h
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mediumResponse">
                Medium Priority Response (hours)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="mediumResponse"
                  type="number"
                  min="0"
                  step="0.5"
                  value={settings.mediumResponseTarget}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      mediumResponseTarget: parseFloat(e.target.value),
                    })
                  }
                />
                <Badge
                  variant="default"
                  className="w-20 justify-center"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {settings.mediumResponseTarget}h
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowResponse">Low Priority Response (hours)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="lowResponse"
                  type="number"
                  min="0"
                  step="0.5"
                  value={settings.lowResponseTarget}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      lowResponseTarget: parseFloat(e.target.value),
                    })
                  }
                />
                <Badge
                  variant="secondary"
                  className="w-20 justify-center"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {settings.lowResponseTarget}h
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Settings</CardTitle>
          <CardDescription>
            Configure automatic ticket handling and escalation rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="autoEscalate">
                  Auto-escalation Timeout (hours)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="autoEscalate"
                    type="number"
                    min="0"
                    step="0.5"
                    value={settings.autoEscalateAfter}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        autoEscalateAfter: parseFloat(e.target.value),
                      })
                    }
                  />
                  <Badge
                    variant="outline"
                    className="w-20 justify-center"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    {settings.autoEscalateAfter}h
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="autoAssign">Enable Auto-assignment</Label>
              <Switch
                id="autoAssign"
                checked={settings.enableAutoAssignment}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    enableAutoAssignment: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="autoSuggest">
                Auto-suggest Knowledge Base Articles
              </Label>
              <Switch
                id="autoSuggest"
                checked={settings.autoSuggestKnowledgeBase}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    autoSuggestKnowledgeBase: checked,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-[200px]"
        >
          {isSaving ? (
            <Spinner className="mr-2" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Settings
        </Button>
      </div>
    </div>
  )
}
