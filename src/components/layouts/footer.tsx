"use client"

import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer
      className="bg-gray-900 text-white py-16"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/robotedge_logo_white_bg.png"
                  alt="Robotedge AI Robotics Lab Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">Robotedge</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Advancing the future of AI and robotics at the University of
              Malaya.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("home")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("about")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("robocup")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  RoboCup
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("research")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Research
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("publications")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Publications
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("industrial")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Industrial Applications
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>umrobotedge@gmail.com</p>
              <p>zati@um.edu.my</p>
              <p>+60 3-7967 4000</p>
              <p>University of Malaya</p>
              <p>50603 Kuala Lumpur, Malaysia</p>
            </div>
          </div>

          {/* Social Media & University */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Instagram: Coming soon!</p>
              <Link
                href="https://www.um.edu.my/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition-colors"
              >
                University of Malaya
              </Link>
              <Link
                href="https://robotedge-um.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition-colors"
              >
                GitHub Repository
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Robotedge - University of Malaya. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link
                href="/login"
                className="hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
