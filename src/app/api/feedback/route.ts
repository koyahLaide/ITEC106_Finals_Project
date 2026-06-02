import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId')

  if (!eventId) {
    return NextResponse.json({ error: 'eventId required' }, { status: 400 })
  }

  try {
    const feedbacks = await db.feedback.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    })

    const avgRating =
      feedbacks.length > 0
        ? Math.round((feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length) * 10) / 10
        : 0

    return NextResponse.json({ feedbacks, avgRating, total: feedbacks.length })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { eventId, studentName, studentEmail, rating, comment } = await req.json()

    if (!eventId || !studentName || !studentEmail || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const existing = await db.feedback.findFirst({
      where: { eventId, studentEmail },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'You have already submitted feedback for this event' },
        { status: 409 }
      )
    }

    const feedback = await db.feedback.create({
      data: { eventId, studentName, studentEmail, rating, comment: comment || '' },
    })

    return NextResponse.json(feedback, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}
