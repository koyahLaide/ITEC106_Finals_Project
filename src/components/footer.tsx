'use client'

import { GraduationCap, MapPin, Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-amber-400" />
              <span className="font-bold text-lg text-white">CvSU Events</span>
            </div>
            <p className="text-emerald-300 text-sm leading-relaxed">
              Campus Event Management System for Cavite State University.
              A platform for managing and discovering campus events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-emerald-300">
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => window.scrollTo(0, 0)}>Home</li>
              <li className="hover:text-white transition-colors cursor-pointer">About</li>
              <li className="hover:text-white transition-colors cursor-pointer">Events</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-emerald-300">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                <span>Indang, Cavite, Philippines</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span>events@cvsu.edu.ph</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <span>(046) 415-2000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800 mt-8 pt-8 text-center">
          <p className="text-sm text-emerald-400">
            © {new Date().getFullYear()} Cavite State University — ITEC 106 Final Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
