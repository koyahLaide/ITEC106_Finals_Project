'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, MessageSquare, Calendar, MapPin, GraduationCap, Send } from 'lucide-react'
import { toast } from 'sonner'

interface EventData {
  id: string
  title: string
  date: string
  time: string
  location: string
  status: string
  organizer: { name: string }
  _count: { participants: number }
}

interface FeedbackData {
  id: string
  studentName: string
  rating: number
  comment: string
  createdAt: string
}

function StarRow({
  value,
  size = 'md',
}: {
  value: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const cls =
    size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${cls} ${
            s <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

const getStatusColor = (status: string) => {
  switch (status) {
    case 'UPCOMING': return 'bg-blue-100 text-blue-700'
    case 'ONGOING': return 'bg-green-100 text-green-700'
    case 'COMPLETED': return 'bg-gray-100 text-gray-700'
    case 'CANCELLED': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export function FeedbackPage() {
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loadingFeedback, setLoadingFeedback] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const savedEmail = localStorage.getItem('studentEmail')
    const savedName = localStorage.getItem('studentName')
    if (savedEmail) setEmail(savedEmail)
    if (savedName) setName(savedName)
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

  const fetchFeedback = async (eventId: string) => {
    setLoadingFeedback(true)
    try {
      const res = await fetch(`/api/feedback?eventId=${eventId}`)
      if (res.ok) {
        const data = await res.json()
        setFeedbacks(data.feedbacks)
        setAvgRating(data.avgRating)
        setTotalReviews(data.total)
      }
    } catch {
      // silent
    } finally {
      setLoadingFeedback(false)
    }
  }

  const openDialog = (event: EventData) => {
    setSelectedEvent(event)
    setRating(0)
    setComment('')
    setDialogOpen(true)
    fetchFeedback(event.id)
  }

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Please enter your name and email')
      return
    }
    if (rating === 0) {
      toast.error('Please select a star rating')
      return
    }
    if (!selectedEvent) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          studentName: name,
          studentEmail: email,
          rating,
          comment,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Thank you for your feedback!')
        localStorage.setItem('studentEmail', email)
        localStorage.setItem('studentName', name)
        setRating(0)
        setComment('')
        fetchFeedback(selectedEvent.id)
      } else {
        toast.error(data.error || 'Failed to submit feedback')
      }
    } catch {
      toast.error('Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  const visibleEvents = events.filter((e) => e.status !== 'CANCELLED')

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <GraduationCap className="h-4 w-4" />
            Student Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Star className="h-8 w-8 fill-amber-400 text-amber-400" />
            Event Feedback &amp; Ratings
          </h1>
          <p className="text-emerald-200">
            Rate events you&apos;ve attended and read what others think
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : visibleEvents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500">No events available</h3>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleEvents.map((event) => (
              <Card
                key={event.id}
                className="group hover:shadow-lg transition-all duration-300 border hover:border-emerald-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-3">
                    {event.title}
                  </h3>
                  <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => openDialog(event)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View / Rate Event
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Feedback Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setSelectedEvent(null)
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg pr-6">{selectedEvent.title}</DialogTitle>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {selectedEvent.date} at {selectedEvent.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {selectedEvent.location}
                  </span>
                </div>
              </DialogHeader>

              <Tabs defaultValue="write">
                <TabsList className="w-full">
                  <TabsTrigger value="write" className="flex-1">
                    <Star className="h-4 w-4 mr-2" />
                    Write Review
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    All Reviews ({totalReviews})
                  </TabsTrigger>
                </TabsList>

                {/* Write Review */}
                <TabsContent value="write" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="fb-name">Full Name</Label>
                      <Input
                        id="fb-name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fb-email">Email</Label>
                      <Input
                        id="fb-email"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Star Selector */}
                  <div>
                    <Label>Rating *</Label>
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 transition-colors ${
                              s <= (hoverRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="ml-2 text-sm text-gray-500">
                          {ratingLabels[rating]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <Label htmlFor="fb-comment">
                      Comment{' '}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      id="fb-comment"
                      placeholder="Share your experience about this event..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleSubmit}
                    disabled={submitting || rating === 0}
                  >
                    {submitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </TabsContent>

                {/* All Reviews */}
                <TabsContent value="reviews" className="mt-4">
                  {loadingFeedback ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-gray-100 animate-pulse rounded" />
                      ))}
                    </div>
                  ) : feedbacks.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No reviews yet. Be the first to rate this event!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Average Rating Summary */}
                      <div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-5 border border-emerald-100">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-emerald-700">
                            {avgRating.toFixed(1)}
                          </p>
                          <StarRow value={Math.round(avgRating)} size="sm" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">Average rating</p>
                        </div>
                      </div>

                      {/* Individual Reviews */}
                      {feedbacks.map((fb) => (
                        <div key={fb.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm text-gray-900">
                                {fb.studentName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(fb.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <StarRow value={fb.rating} size="sm" />
                          </div>
                          {fb.comment && (
                            <p className="text-sm text-gray-600 mt-2">{fb.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
