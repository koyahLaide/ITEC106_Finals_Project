'use client'

import { useEffect } from 'react'
import { useAppStore, type PageName } from '@/lib/store'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HomePage } from '@/views/HomePage'
import { AboutPage } from '@/views/AboutPage'
import { EventsPage } from '@/views/EventsPage'
import { LoginPage } from '@/views/LoginPage'
import { RegisterPage } from '@/views/RegisterPage'
import { DashboardPage } from '@/views/admin/DashboardPage'
import { EventManagementPage } from '@/views/admin/EventManagementPage'
import { ParticipantManagementPage } from '@/views/admin/ParticipantManagementPage'
import { StudentEventsPage } from '@/views/student/StudentEventsPage'
import { MyRegistrationsPage } from '@/views/student/MyRegistrationsPage'
import { AttendanceScannerPage } from '@/views/admin/AttendanceScannerPage'
import { FeedbackPage } from '@/views/student/FeedbackPage'

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
