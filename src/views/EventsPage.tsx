'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Calendar, MapPin, Users, Search, UserPlus, QrCode, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface EventData {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  status: string
  organizer: { name: string }
  _count: { participants: number }
}

export function EventsPage() {
  const { user, setPage } = useAppStore()
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registering, setRegistering] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events')
      if (res.ok) setEvents(await res.json())
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleRegister = async () => {
    if (!registerName.trim() || !registerEmail.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    if (!selectedEvent) return

    setRegistering(true)
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          studentName: registerName,
          studentEmail: registerEmail,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setConfirmationCode(data.id)
        toast.success('Successfully registered!')
        fetchEvents()
      } else {
        toast.error(data.error || 'Registration failed')
      }
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-700'
      case 'ONGOING': return 'bg-green-100 text-green-700'
      case 'COMPLETED': return 'bg-gray-100 text-gray-700'
      case 'CANCELLED': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Campus Events</h1>
          <p className="text-emerald-200">Discover and register for events happening at CvSU</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
              >
                {status === 'ALL' ? 'All Events' : status.charAt(0) + status.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500">No events found</h3>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 border hover:border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                    <span className="text-xs text-gray-400">ID: {event.id.slice(-6)}</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{event.description}</p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{event._count.participants} / {event.capacity} registered</span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Capacity</span>
                      <span>{Math.round((event._count.participants / event.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          (event._count.participants / event.capacity) > 0.8
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min((event._count.participants / event.capacity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      onClick={() => setSelectedEvent(event)}
                    >
                      View Details
                    </Button>
                    {(event.status === 'UPCOMING' || event.status === 'ONGOING') && event._count.participants < event.capacity && (
                      <Button
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => {
                          setSelectedEvent(event)
                          setRegisterOpen(true)
                          setConfirmationCode(null)
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Register
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent && !registerOpen} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-lg">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Badge className={getStatusColor(selectedEvent.status)}>{selectedEvent.status}</Badge>
                <p className="text-gray-600">{selectedEvent.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    <span>{selectedEvent.date} at {selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4 text-emerald-500" />
                    <span>{selectedEvent._count.participants} / {selectedEvent.capacity} registered</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span>Organized by {selectedEvent.organizer.name}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                {(selectedEvent.status === 'UPCOMING' || selectedEvent.status === 'ONGOING') && selectedEvent._count.participants < selectedEvent.capacity && (
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                      setRegisterOpen(true)
                      setConfirmationCode(null)
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register Now
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Registration Dialog */}
      <Dialog open={registerOpen} onOpenChange={(open) => {
        if (!open) {
          setRegisterOpen(false)
          setConfirmationCode(null)
          setRegisterName('')
          setRegisterEmail('')
        }
      }}>
        <DialogContent className="max-w-md">
          {confirmationCode ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  Registration Successful!
                </DialogTitle>
              </DialogHeader>
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                  <QrCode className="h-8 w-8 text-emerald-600" />
                </div>
                <p className="text-gray-600 mb-4">Your registration has been confirmed. Save this code for attendance verification.</p>
                <div className="bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Registration Code</p>
                  <p className="text-2xl font-mono font-bold text-emerald-700 tracking-wider">{confirmationCode.toUpperCase()}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setRegisterOpen(false)
                  setConfirmationCode(null)
                }}>Done</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Register for Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-lg p-3 text-sm text-emerald-700">
                  <strong>{selectedEvent?.title}</strong>
                  <p className="text-emerald-600 text-xs mt-1">{selectedEvent?.date} at {selectedEvent?.time}</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input
                      id="reg-name"
                      placeholder="Enter your full name"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-email">Email Address</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRegisterOpen(false)}>Cancel</Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleRegister}
                  disabled={registering}
                >
                  {registering ? 'Registering...' : 'Register'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
