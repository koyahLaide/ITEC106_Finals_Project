'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAppStore, type PageName } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { GraduationCap, Menu, X, LogOut, LayoutDashboard, Calendar, Users, QrCode, Star } from 'lucide-react'

const publicLinks: { label: string; page: PageName }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Events', page: 'events' },
]

const adminLinks: { label: string; page: PageName; icon: React.ReactNode }[] = [
  { label: 'Dashboard', page: 'admin-dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Events', page: 'admin-events', icon: <Calendar className="h-4 w-4" /> },
  { label: 'Participants', page: 'admin-participants', icon: <Users className="h-4 w-4" /> },
  { label: 'Attendance', page: 'admin-attendance', icon: <QrCode className="h-4 w-4" /> },
]

const studentLinks: { label: string; page: PageName; icon: React.ReactNode }[] = [
  { label: 'Events', page: 'student-events', icon: <Calendar className="h-4 w-4" /> },
  { label: 'My Registrations', page: 'student-registered', icon: <Users className="h-4 w-4" /> },
  { label: 'Feedback', page: 'student-feedback', icon: <Star className="h-4 w-4" /> },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, currentPage, setPage, logout } = useAppStore()

  const handleNav = (page: PageName) => {
    setPage(page)
    setOpen(false)
    window.scrollTo(0, 0)
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button
          onClick={() => handleNav(user?.role === 'ADMIN' ? 'admin-dashboard' : user?.role === 'STUDENT' ? 'student-events' : 'home')}
          className="flex items-center gap-2 font-bold text-lg text-emerald-700 hover:text-emerald-600 transition-colors"
        >
          <GraduationCap className="h-6 w-6" />
          <span>CvSU Events</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {!user && publicLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNav(link.page)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          {user?.role === 'ADMIN' && adminLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNav(link.page)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}

          {user?.role === 'STUDENT' && studentLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNav(link.page)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}

          {!user ? (
            <div className="flex items-center gap-2 ml-2">
              <Button variant="ghost" size="sm" onClick={() => handleNav('login')}>
                Login
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleNav('register')}>
                Register
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-2 pl-2 border-l">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-emerald-700">{user.name}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2 font-bold text-lg text-emerald-700">
                  <GraduationCap className="h-5 w-5" />
                  CvSU Events
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {!user && publicLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => handleNav(link.page)}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      currentPage === link.page
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                {user?.role === 'ADMIN' && adminLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => handleNav(link.page)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      currentPage === link.page
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </button>
                ))}

                {user?.role === 'STUDENT' && studentLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => handleNav(link.page)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      currentPage === link.page
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t">
                {!user ? (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" onClick={() => handleNav('login')}>
                      Login
                    </Button>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleNav('register')}>
                      Register
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-500">Logged in as</span>
                      <p className="font-medium text-emerald-700">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
