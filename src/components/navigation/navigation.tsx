"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#robocup", label: "RoboCup" },
  { href: "#research", label: "Research" },
  { href: "#publications", label: "Publications" },
  { href: "#industrial", label: "Industrial Applications" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)

      // Update active section based on scroll position
      const sections = navItems.map((item) => item.href.slice(1))
      const scrollPosition = window.scrollY + 150

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setIsOpen(false)

    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/98 backdrop-blur-sm shadow-lg"
          : "bg-white/95 backdrop-blur-sm shadow-md"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="#home"
              className="flex items-center space-x-2"
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/robotedge_logo_white_bg.png"
                  alt="Robotedge AI Robotics Lab Logo - University of Malaya"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">Robotedge</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul
            className="hidden md:flex items-center space-x-8"
            role="menubar"
          >
            {navItems.map((item) => (
              <li
                key={item.href}
                role="none"
              >
                <button
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors duration-200",
                    activeSection === item.href.slice(1)
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  )}
                  role="menuitem"
                  aria-label={`Go to ${item.label} section`}
                >
                  {item.label}
                  {/* Active indicator */}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transition-transform duration-200",
                      activeSection === item.href.slice(1)
                        ? "scale-x-100"
                        : "scale-x-0"
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isOpen}
              aria-label="Toggle mobile menu"
            >
              {isOpen ? (
                <X
                  className="block h-6 w-6"
                  aria-hidden="true"
                />
              ) : (
                <Menu
                  className="block h-6 w-6"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200",
                  activeSection === item.href.slice(1)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                )}
                role="menuitem"
                aria-label={`Go to ${item.label} section`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
