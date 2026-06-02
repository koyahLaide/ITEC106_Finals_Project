'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Users, Search, Trash2, UserX, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface EventOption {
  id: string
  title: string
}

interface ParticipantData {
  id: string
  eventId: string
  studentName: string
  studentEmail: string
  status: string
  registeredAt: string
  event?: { title: string }
}

export function ParticipantManagementPage() {
  const [participants, setParticipants] = useState<ParticipantData[]>([])
  const [events, setEvents] = useState<EventOption[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [eventFilter, setEventFilter] = useState('ALL')

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, eRes] = await Promise.all([
          fetch('/api/participants'),
          fetch('/api/events'),
        ])
        if (pRes.ok) setParticipants(await pRes.json())
        if (eRes.ok) {
          const eData = await eRes.json()
          setEvents(eData.map((e: EventOption) => ({ id: e.id, title: e.title })))
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.studentEmail.toLowerCase().includes(search.toLowerCase())
    const matchesEvent = eventFilter === 'ALL' || p.eventId === eventFilter
    return matchesSearch && matchesEvent
  })

  const handleCancelRegistration = async (id: string) => {
    try {
      const res = await fetch(`/api/participants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })
      if (res.ok) {
        toast.success('Registration cancelled')
        setParticipants((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: 'CANCELLED' } : p))
        )
      } else {
        toast.error('Failed to cancel registration')
      }
    } catch {
      toast.error('Failed to cancel registration')
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch(`/api/participants/${deletingId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Participant removed')
        setParticipants((prev) => prev.filter((p) => p.id !== deletingId))
      } else {
        toast.error('Failed to remove participant')
      }
    } catch {
      toast.error('Failed to remove participant')
    } finally {
      setDeleteOpen(false)
      setDeletingId(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Participant Management</h1>
          <p className="text-emerald-200">View and manage event registrations</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter by event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Events</SelectItem>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">{participants.length}</p>
              <p className="text-xs text-gray-500">Total Registrations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {participants.filter((p) => p.status === 'REGISTERED').length}
              </p>
              <p className="text-xs text-gray-500">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-500">
                {participants.filter((p) => p.status === 'CANCELLED').length}
              </p>
              <p className="text-xs text-gray-500">Cancelled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{events.length}</p>
              <p className="text-xs text-gray-500">Events</p>
            </CardContent>
          </Card>
        </div>

        {/* Participants Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
                ))}
              </div>
            ) : filteredParticipants.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No participants found</h3>
                <p className="text-sm text-gray-400 mt-1">Adjust your search or filter criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Event</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Registration Code</TableHead>
                      <TableHead className="hidden lg:table-cell">Registered At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.studentName}</TableCell>
                        <TableCell className="text-sm text-gray-600">{p.studentEmail}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          {p.event?.title || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            p.status === 'REGISTERED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {p.id.slice(-8).toUpperCase()}
                          </code>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                          {new Date(p.registeredAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {p.status === 'REGISTERED' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                onClick={() => handleCancelRegistration(p.id)}
                                title="Cancel Registration"
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setDeletingId(p.id)
                                setDeleteOpen(true)
                              }}
                              title="Remove Participant"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Participant</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this participant record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
