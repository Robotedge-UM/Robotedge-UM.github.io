"use client"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface AccordionProps {
  items: {
    id: string
    title: string
    content: React.ReactNode
    icon?: React.ReactNode
  }[]
  defaultOpen?: string[]
  className?: string
}

export function Accordion({
  items,
  defaultOpen = [],
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id)

        return (
          <div
            key={item.id}
            className="glass-morphism rounded-lg overflow-hidden transition-all duration-300 card-hover"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex items-center justify-between w-full p-4 text-left focus-ring"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <div className="flex-shrink-0 text-primary">{item.icon}</div>
                )}
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-primary transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="p-4 pt-0 border-t border-white/10">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
