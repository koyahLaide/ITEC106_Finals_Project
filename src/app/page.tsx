'use client'

import { useEffect } from 'react'
import { useAppStore, type PageName } from '@/lib/store'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { EventsPage } from '@/pages/EventsPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { EventManagementPage } from '@/pages/admin/EventManagementPage'
import { ParticipantManagementPage } from '@/pages/admin/ParticipantManagementPage'
import { StudentEventsPage } from '@/pages/student/StudentEventsPage'
import { MyRegistrationsPage } from '@/pages/student/MyRegistrationsPage'
import { AttendanceScannerPage } from '@/pages/admin/AttendanceScannerPage'
import { FeedbackPage } from '@/pages/student/FeedbackPage'

function PageRenderer({ page }: { page: PageName }) {
  switch (page) {
    case 'home':
      return <HomePage />
    case 'about':
      return <AboutPage />
    case 'events':
      return <EventsPage />
    case 'login':
      return <LoginPage />
    case 'register':
      return <RegisterPage />
    case 'admin-dashboard':
      return <DashboardPage />
    case 'admin-events':
      return <EventManagementPage />
    case 'admin-participants':
      return <ParticipantManagementPage />
    case 'student-events':
      return <StudentEventsPage />
    case 'student-registered':
      return <MyRegistrationsPage />
    case 'admin-attendance':
      return <AttendanceScannerPage />
    case 'student-feedback':
      return <FeedbackPage />
    default:
      return <HomePage />
  }
}

export default function Home() {
  const { currentPage } = useAppStore()

  // Seed database on first load
  useEffect(() => {
    fetch('/api/seed', { method: 'POST' }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <PageRenderer page={currentPage} />
      </main>
      <Footer />
    </div>
  )
}
