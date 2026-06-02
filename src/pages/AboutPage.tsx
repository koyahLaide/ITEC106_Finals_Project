'use client'

import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Calendar, Users, Shield, Globe, BookOpen, Code, Target } from 'lucide-react'

const features = [
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Event Management',
    description: 'Create, edit, and manage campus events with an intuitive admin dashboard.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Student Registration',
    description: 'Students can register for events without needing an account—just name and email.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Role-Based Access',
    description: 'Separate views for administrators and students with appropriate permissions.',
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Real-Time Updates',
    description: 'Live participant counts, capacity tracking, and event status updates.',
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Event Search & Filter',
    description: 'Search events by title and filter by status—Upcoming, Ongoing, or Completed.',
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: 'Registration Codes',
    description: 'Each registration generates a unique confirmation code for verification.',
  },
]

const techStack = [
  { name: 'Next.js 16', desc: 'Full-stack React Framework' },
  { name: 'TypeScript', desc: 'Type-Safe Development' },
  { name: 'Prisma ORM', desc: 'Database Management' },
  { name: 'Tailwind CSS', desc: 'Utility-First Styling' },
  { name: 'SQLite', desc: 'Lightweight Database' },
  { name: 'Zustand', desc: 'State Management' },
]

export function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <GraduationCap className="h-4 w-4" />
            ITEC 106 Final Project
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About the System</h1>
          <p className="text-lg text-emerald-200 max-w-2xl mx-auto">
            A comprehensive Campus Event Management System designed for Cavite State University
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Streamlining Campus Events
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The CvSU Campus Event Management System is a web-based application designed to simplify the process
              of organizing and participating in campus events. Built as part of the ITEC 106 Software Engineering
              course, this system demonstrates modern web development practices.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              From seminars and workshops to competitions and career talks, this platform provides a centralized
              hub for all campus activities. Administrators can create and manage events while students can
              discover and register for activities that interest them.
            </p>
            <div className="flex items-center gap-2 text-emerald-700">
              <Target className="h-5 w-5" />
              <span className="font-medium">Cavite State University — Indang, Cavite</span>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-8 border-2 border-emerald-100">
            <h3 className="text-lg font-bold text-emerald-800 mb-4">Project Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-emerald-200">
                <span className="text-gray-500">Course</span>
                <span className="font-medium text-gray-900">ITEC 106 — Software Engineering</span>
              </div>
              <div className="flex justify-between py-2 border-b border-emerald-200">
                <span className="text-gray-500">Project Type</span>
                <span className="font-medium text-gray-900">Final Project</span>
              </div>
              <div className="flex justify-between py-2 border-b border-emerald-200">
                <span className="text-gray-500">Framework</span>
                <span className="font-medium text-gray-900">Next.js 16 + TypeScript</span>
              </div>
              <div className="flex justify-between py-2 border-b border-emerald-200">
                <span className="text-gray-500">Database</span>
                <span className="font-medium text-gray-900">MySQL + Prisma ORM</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Styling</span>
                <span className="font-medium text-gray-900">Tailwind CSS + shadcn/ui</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Key Features</h2>
            <p className="text-gray-500">What makes this system stand out</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border hover:border-emerald-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Technology Stack</h2>
          <p className="text-gray-500">Built with modern, industry-standard tools</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStack.map((tech) => (
            <Card key={tech.name} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 text-sm">{tech.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{tech.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
