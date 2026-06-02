'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  QrCode, CheckCircle2, XCircle, AlertCircle, Users,
  UserCheck, Clock, RotateCcw, ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'

interface EventData {
  id: string
  title: string
  date: string
  time: string
  status: string
}

interface ParticipantData {
  id: string
  studentName: string
  studentEmail: string
  status: string
  registeredAt: string
  checkedIn: boolean
  checkedInAt: string | null
}

interface AttendanceStats {
  total: number
  checkedIn: number
  pending: number
}

type ScanResult = {
  type: 'success' | 'already' | 'error'
  message: string
  participant?: ParticipantData
}

export function AttendanceScannerPage() {
  const [events, setEvents] = useState<EventData[]>([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [code, setCode] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [participants, setParticipants] = useState<ParticipantData[]>([])
  const [stats, setStats] = useState<AttendanceStats>({ total: 0, checkedIn: 0, pending: 0 })
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchAttendance = useCallback(async (eventId: string) => {
    if (!eventId) return
    setLoadingAttendance(true)
    try {
      const res = await fetch(`/api/attendance?eventId=${eventId}`)
      if (res.ok) {
        const data = await res.json()
        setParticipants(data.participants)
        setStats(data.stats)
      }
    } catch {
      // silent
    } finally {
      setLoadingAttendance(false)
    }
  }, [])

  useEffect(() => {
    if (selectedEventId) fetchAttendance(selectedEventId)
  }, [selectedEventId, fetchAttendance])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events')
      if (res.ok) setEvents(await res.json())
    } catch {
      // silent
    }
  }

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEventId) { toast.error('Please select an event first'); return }
    if (!code.trim()) { toast.error('Please enter a registration code'); return }

    setScanning(true)
    setScanResult(null)
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: selectedEventId, code: code.trim() }),
      })
      const data = await res.json()

      if (res.ok) {
        setScanResult({
          type: 'success',
          message: `${data.participant.studentName} checked in successfully!`,
          participant: data.participant,
        })
        toast.success('Check-in successful!')
        fetchAttendance(selectedEventId)
      } else if (res.status === 409) {
        setScanResult({ type: 'already', message: data.error, participant: data.participant })
      } else {
        setScanResult({ type: 'error', message: data.error || 'Registration code not found' })
      }
    } catch {
      setScanResult({ type: 'error', message: 'Check-in failed. Please try again.' })
    } finally {
      setScanning(false)
      setCode('')
    }
  }

  const handleReset = async () => {
    setResetting(true)
    try {
      const res = await fetch('/api/attendance/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: selectedEventId }),
      })
      if (res.ok) {
        toast.success('Attendance reset successfully')
        fetchAttendance(selectedEventId)
        setScanResult(null)
      } else {
        toast.error('Failed to reset attendance')
      }
    } catch {
      toast.error('Failed to reset attendance')
    } finally {
      setResetting(false)
      setResetOpen(false)
    }
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId)
  const checkedInPct = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <ShieldCheck className="h-4 w-4" />
            Admin Panel
          </div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <QrCode className="h-8 w-8" />
            Attendance Scanner
          </h1>
          <p className="text-emerald-200">
            Check in registered students by entering their 8-character registration code
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Scanner Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Event Selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Select Event</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedEventId}
                  onValueChange={(val) => { setSelectedEventId(val); setScanResult(null) }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an event..." />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        <span className="font-medium">{event.title}</span>
                        <span className="text-xs text-gray-400 ml-2">{event.date}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Code Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-emerald-600" />
                  Enter Registration Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckIn} className="space-y-3">
                  <div>
                    <Label htmlFor="reg-code">Registration Code</Label>
                    <Input
                      id="reg-code"
                      placeholder="e.g. A1B2C3D4"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="font-mono text-center text-lg tracking-widest mt-1"
                      disabled={!selectedEventId}
                      autoComplete="off"
                      maxLength={30}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Enter the code from the student&apos;s registration confirmation
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={scanning || !selectedEventId || !code.trim()}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {scanning ? 'Checking in...' : 'Check In Student'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Scan Result */}
            {scanResult && (
              <Card className={`border-2 ${
                scanResult.type === 'success'
                  ? 'border-emerald-400 bg-emerald-50'
                  : scanResult.type === 'already'
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-red-400 bg-red-50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {scanResult.type === 'success' ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    ) : scanResult.type === 'already' ? (
                      <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-semibold text-sm ${
                        scanResult.type === 'success' ? 'text-emerald-800'
                        : scanResult.type === 'already' ? 'text-amber-800'
                        : 'text-red-800'
                      }`}>
                        {scanResult.type === 'success'
                          ? 'Check-In Successful'
                          : scanResult.type === 'already'
                          ? 'Already Checked In'
                          : 'Not Found'}
                      </p>
                      <p className={`text-xs mt-1 ${
                        scanResult.type === 'success' ? 'text-emerald-700'
                        : scanResult.type === 'already' ? 'text-amber-700'
                        : 'text-red-700'
                      }`}>
                        {scanResult.message}
                      </p>
                      {scanResult.participant && scanResult.type === 'success' && (
                        <p className="text-xs text-emerald-600 mt-0.5">
                          {scanResult.participant.studentEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Stats & Participant List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">Registered</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-700">{stats.checkedIn}</p>
                  <p className="text-xs text-gray-500">Checked In</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Bar */}
            {selectedEventId && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Attendance Progress</span>
                    <span className="text-sm font-bold text-emerald-700">{checkedInPct}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${checkedInPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {stats.checkedIn} of {stats.total} students checked in
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Participant Table */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Participant List</CardTitle>
                  {selectedEventId && stats.total > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => setResetOpen(true)}
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Reset Attendance
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {!selectedEventId ? (
                  <div className="p-10 text-center text-gray-400">
                    <QrCode className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Select an event to view participants</p>
                  </div>
                ) : loadingAttendance ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />
                    ))}
                  </div>
                ) : participants.length === 0 ? (
                  <div className="p-10 text-center text-gray-400">
                    <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No registered participants yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden lg:table-cell">Check-in Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.map((p) => (
                          <TableRow key={p.id} className={p.checkedIn ? 'bg-emerald-50/50' : ''}>
                            <TableCell className="font-medium text-sm">{p.studentName}</TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-gray-500">
                              {p.studentEmail}
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">
                                {p.id.slice(-8).toUpperCase()}
                              </code>
                            </TableCell>
                            <TableCell>
                              {p.checkedIn ? (
                                <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Checked In
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-100 text-amber-700 gap-1">
                                  <Clock className="h-3 w-3" />
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                              {p.checkedIn && p.checkedInAt
                                ? new Date(p.checkedInAt).toLocaleTimeString()
                                : '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reset Confirmation */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Attendance</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all check-in records for{' '}
              <strong>{selectedEvent?.title}</strong>. All participants will be
              marked as pending again. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={resetting}
            >
              {resetting ? 'Resetting...' : 'Reset Attendance'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
