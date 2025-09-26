"use client"

import { useFooterData } from "@/hooks/use-footer-data"
import { MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  const { footerData } = useFooterData()
  return (
    <footer
      className="py-16 text-white bg-black"
      role="contentinfo"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left Column - Logo, Description & Social Media */}
          <div>
            <div className="flex items-center mb-6 space-x-3">
              <Image
                src={footerData.companyLogo}
                alt={`${footerData.companyName} Logo`}
                width={300}
                height={200}
                className="object-contain"
              />
            </div>

            <p className="mb-6 text-sm leading-relaxed text-gray-300">
              Advancing the future of AI and robotics at Universiti Malaya.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href={footerData.emailUrl}
                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-700"
                aria-label="Email"
              >
                <Image
                  src="/icons/mail.svg"
                  alt="Email Icon"
                  width={20}
                  height={20}
                  className="object-contain w-5 h-5"
                />
              </a>
              {footerData.facebookUrl && (
                <a
                  href={footerData.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2 rounded-full hover:bg-gray-700"
                  aria-label="Facebook"
                >
                  <Image
                    src="/icons/facebook.svg"
                    alt="Facebook Icon"
                    width={20}
                    height={20}
                    className="object-contain w-5 h-5"
                  />
                </a>
              )}
              {footerData.linkedinUrl && (
                <a
                  href={footerData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2 rounded-full hover:bg-gray-700"
                  aria-label="LinkedIn"
                >
                  <Image
                    src="/icons/linkedin.svg"
                    alt="LinkedIn Icon"
                    width={20}
                    height={20}
                    className="object-contain w-5 h-5"
                  />
                </a>
              )}
              {footerData.instagramUrl && (
                <a
                  href={footerData.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2 rounded-full hover:bg-gray-700"
                  aria-label="Instagram"
                >
                  <Image
                    src="/icons/instagram.svg"
                    alt="Instagram Icon"
                    width={20}
                    height={20}
                    className="object-contain w-5 h-5"
                  />
                </a>
              )}
            </div>
          </div>

          {/* Middle Column - Contact Information */}
          <div>
            <h4 className="mb-6 text-lg font-semibold text-white">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Image
                  src="/icons/mail.svg"
                  alt="Email Icon"
                  width={20}
                  height={20}
                  className="object-contain w-5 h-5"
                />
                <div className="text-sm text-gray-300 hover:text-blue-300">
                  <a href={`mailto:${footerData.contactEmail}`}>
                    {footerData.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Image
                  src="/icons/marker.svg"
                  alt="Location Icon"
                  width={20}
                  height={20}
                  className="object-contain w-5 h-5"
                />
                <div className="text-sm text-gray-300 hover:text-blue-300">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      footerData.contactAddress
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {footerData.contactAddress}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Maps Location */}
          <div>
            <h4 className="mb-6 text-lg font-semibold text-white">
              Maps Location
            </h4>
            <div className="relative">
              {footerData.mapEmbedUrl ? (
                <iframe
                  src={footerData.mapEmbedUrl}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              ) : (
                <div className="flex items-center justify-center w-full h-48 bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                    <p className="text-sm text-gray-400">Universiti Malaya</p>
                    <p className="text-xs text-gray-500">
                      Kuala Lumpur, Malaysia
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-gray-800">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 {footerData.companyName}
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link
                href="/login"
                className="transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="transition-colors hover:text-white"
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
