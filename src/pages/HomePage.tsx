'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Users, ArrowRight, GraduationCap, TrendingUp, Star } from 'lucide-react'

interface EventData {
  id: string
  title: string
  date: string
  time: string
  location: string
  capacity: number
  status: string
  _count: { participants: number }
}

export function HomePage() {
  const { setPage, user } = useAppStore()
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/events')
        if (res.ok) {
          const data = await res.json()
          setEvents(data.filter((e: EventData) => e.status === 'UPCOMING' || e.status === 'ONGOING').slice(0, 3))
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalParticipants = events.reduce((acc, e) => acc + e._count.participants, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuMTA1IDAgMi0uODk1IDItMnMtLjg5NS0yLTItMi0yIC44OTUtMiAyIC44OTUgMiAyIDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="h-4 w-4" />
              Cavite State University
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Campus Event
              <span className="block text-amber-400">Management System</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-200 mb-8 max-w-2xl leading-relaxed">
              Discover, register, and manage campus events at CvSU. Stay connected with the latest activities,
              workshops, seminars, and competitions happening across the university.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-emerald-900 font-semibold"
                onClick={() => setPage(user?.role === 'ADMIN' ? 'admin-events' : 'events')}
              >
                Browse Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white/60 text-white hover:bg-white/10 hover:text-white"
                onClick={() => setPage('about')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="border-2 border-emerald-100 hover:border-emerald-200 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-700">{events.length}+</div>
              <p className="text-gray-500 text-sm mt-1">Active Events</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-100 hover:border-amber-200 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-4">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-700">{totalParticipants}+</div>
              <p className="text-gray-500 text-sm mt-1">Registered Participants</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-emerald-100 hover:border-emerald-200 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-700">4+</div>
              <p className="text-gray-500 text-sm mt-1">Event Categories</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Events */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Events</h2>
              <p className="text-gray-500 mt-1">Don&apos;t miss these upcoming campus activities</p>
            </div>
            <Button
              variant="outline"
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              onClick={() => setPage('events')}
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No upcoming events</h3>
                <p className="text-sm text-gray-400 mt-1">Check back soon for new events!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-emerald-200"
                  onClick={() => setPage('events')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'UPCOMING'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-3">
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        <span>{event.date} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-500" />
                        <span>{event._count.participants}/{event.capacity} registered</span>
                      </div>
                    </div>
                    {/* Capacity Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min((event._count.participants / event.capacity) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white border-0">
          <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center">
                <Star className="h-6 w-6 text-emerald-900" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ready to explore campus events?</h3>
                <p className="text-emerald-200 text-sm">Register for events or manage your own activities.</p>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-emerald-900 font-semibold shrink-0"
              onClick={() => setPage('events')}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
