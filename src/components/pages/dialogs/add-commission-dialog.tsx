"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"

interface AddCommissionDialogProps {
  onSuccess: () => void
}

export function AddCommissionDialog({ onSuccess }: AddCommissionDialogProps) {
  const [open, setOpen] = useState(false)
  const [level, setLevel] = useState("")
  const [rate, setRate] = useState("")

  const handleSubmit = async () => {
    try {
      if (!level || !rate) {
        toast.error("Please fill in all fields")
        return
      }

      const parsedRate = parseFloat(rate) / 100 // Convert percentage to decimal
      if (parsedRate < 0 || parsedRate > 1) {
        toast.error("Rate must be between 0% and 100%")
        return
      }

      const response = await fetch(
        "/api/dashboard/system-settings/commissions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            level: parseInt(level),
            rate: parsedRate,
          }),
        }
      )

      if (!response.ok) throw new Error("Failed to create commission setting")

      toast.success("Commission setting created successfully")
      setOpen(false)
      onSuccess()

      // Reset form
      setLevel("")
      setRate("")
    } catch (error) {
      toast.error("Failed to create commission setting")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add New Commission
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Commission Setting</DialogTitle>
          <DialogDescription>
            Create a new commission level with its rate. All fields are
            required.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Level (0-4)</Label>
            <Input
              type="number"
              placeholder="Enter level number"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              min="0"
              max="4"
            />
            <p className="text-xs text-muted-foreground">
              Level 0 is for admin commission, 1-4 for referral levels
            </p>
          </div>

          <div className="space-y-2">
            <Label>Commission Rate (%)</Label>
            <Input
              type="number"
              placeholder="Enter rate percentage"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              min="0"
              max="100"
            />
            <p className="text-xs text-muted-foreground">
              Enter a value between 0 and 100
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Commission</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
