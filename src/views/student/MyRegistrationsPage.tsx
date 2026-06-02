'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Users, Search, QrCode, XCircle, Calendar, MapPin, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'

interface RegistrationData {
  id: string
  eventId: string
  studentName: string
  studentEmail: string
  status: string
  registeredAt: string
  event: {
    id: string
    title: string
    date: string
    time: string
    location: string
    status: string
  }
}

export function MyRegistrationsPage() {
  const [email, setEmail] = useState('')
  const [registrations, setRegistrations] = useState<RegistrationData[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedReg, setSelectedReg] = useState<RegistrationData | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/participants?studentEmail=${encodeURIComponent(email)}`)
      if (res.ok) {
        setRegistrations(await res.json())
      } else {
        toast.error('Failed to fetch registrations')
      }
    } catch {
      toast.error('Failed to fetch registrations')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!selectedReg) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/participants/${selectedReg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })
      if (res.ok) {
        toast.success('Registration cancelled')
        setRegistrations((prev) =>
          prev.map((r) => (r.id === selectedReg.id ? { ...r, status: 'CANCELLED' } : r))
        )
        setSelectedReg(null)
      } else {
        toast.error('Failed to cancel registration')
      }
    } catch {
      toast.error('Failed to cancel registration')
    } finally {
      setCancelling(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-700'
      case 'ONGOING': return 'bg-green-100 text-green-700'
      case 'COMPLETED': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <GraduationCap className="h-4 w-4" />
            Student Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Registrations</h1>
          <p className="text-emerald-200">Look up your event registrations using your email</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter your email to find registrations..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  type="email"
                  required
                />
              </div>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Look Up'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && (
          <>
            {registrations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">No registrations found</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    No registrations found for <span className="font-medium">{email}</span>
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <p className="text-sm text-gray-500">
                      Found <span className="font-medium text-emerald-700">{registrations.length}</span> registration(s) for {email}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event</TableHead>
                          <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden sm:table-cell">Reg. Code</TableHead>
                          <TableHead className="hidden lg:table-cell">Registered At</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registrations.map((reg) => (
                          <TableRow key={reg.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-gray-900">{reg.event.title}</p>
                                <div className="md:hidden flex items-center gap-1 text-xs text-gray-400 mt-1">
                                  <Calendar className="h-3 w-3" />
                                  {reg.event.date}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm">
                              {reg.event.date} at {reg.event.time}
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                reg.status === 'REGISTERED'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }>
                                {reg.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                {reg.id.slice(-8).toUpperCase()}
                              </code>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                              {new Date(reg.registeredAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {reg.status === 'REGISTERED' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => setSelectedReg(reg)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </section>

      {/* Cancel Confirmation */}
      <Dialog open={!!selectedReg} onOpenChange={(open) => !open && setSelectedReg(null)}>
        <DialogContent className="max-w-md">
          {selectedReg && (
            <>
              <DialogHeader>
                <DialogTitle>Cancel Registration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-700">
                    Are you sure you want to cancel your registration for:
                  </p>
                  <p className="font-semibold text-red-800 mt-2">{selectedReg.event.title}</p>
                  <p className="text-xs text-red-600 mt-1">
                    {selectedReg.event.date} at {selectedReg.event.time}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <QrCode className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-500">Registration Code:</span>
                    <code className="font-mono font-bold">{selectedReg.id.slice(-8).toUpperCase()}</code>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedReg(null)}>Keep Registration</Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Registration'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
