'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Users, TrendingUp, Clock, BarChart3, ArrowUpRight } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

interface EventData {
  id: string
  title: string
  status: string
  _count: { participants: number }
  capacity: number
}

export function DashboardPage() {
  const { user, setPage } = useAppStore()
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/events')
        if (res.ok) setEvents(await res.json())
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalEvents = events.length
  const totalParticipants = events.reduce((acc, e) => acc + e._count.participants, 0)
  const upcomingCount = events.filter((e) => e.status === 'UPCOMING').length
  const ongoingCount = events.filter((e) => e.status === 'ONGOING').length

  const chartData = events
    .filter((e) => e._count.participants > 0)
    .map((e) => ({
      name: e.title.length > 20 ? e.title.slice(0, 20) + '...' : e.title,
      participants: e._count.participants,
      capacity: e.capacity,
    }))

  const COLORS = ['#059669', '#d97706', '#0891b2', '#dc2626', '#7c3aed', '#2563eb']

  const stats = [
    {
      label: 'Total Events',
      value: totalEvents,
      icon: <Calendar className="h-5 w-5" />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      label: 'Total Participants',
      value: totalParticipants,
      icon: <Users className="h-5 w-5" />,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
    {
      label: 'Upcoming Events',
      value: upcomingCount,
      icon: <Clock className="h-5 w-5" />,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Ongoing Events',
      value: ongoingCount,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
  ]

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-emerald-200">Welcome back, {user?.name || 'Admin'}. Here&apos;s an overview of campus events.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{loading ? '-' : stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Participants per Event</h2>
            </div>
            {loading ? (
              <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            ) : chartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No participant data available yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    angle={-30}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    formatter={(value: number, _name: string) => [`${value} participants`, 'Registered']}
                  />
                  <Bar dataKey="participants" radius={[6, 6, 0, 0]}>
                    {chartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">All Events Overview</h2>
              </div>
              <button
                onClick={() => setPage('admin-events')}
                className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                Manage Events <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{event.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event._count.participants}/{event.capacity}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 shrink-0 ${
                      event.status === 'UPCOMING'
                        ? 'bg-blue-100 text-blue-700'
                        : event.status === 'ONGOING'
                        ? 'bg-green-100 text-green-700'
                        : event.status === 'COMPLETED'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
