import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const studentEmail = searchParams.get('studentEmail')

    if (eventId) {
      const participants = await db.participant.findMany({
        where: { eventId },
        orderBy: { registeredAt: 'desc' },
      })
      return NextResponse.json(participants)
    }

    if (studentEmail) {
      const participants = await db.participant.findMany({
        where: { studentEmail },
        include: { event: true },
        orderBy: { registeredAt: 'desc' },
      })
      return NextResponse.json(participants)
    }

    const participants = await db.participant.findMany({
      include: { event: { select: { title: true } } },
      orderBy: { registeredAt: 'desc' },
    })
    return NextResponse.json(participants)
  } catch (error) {
    console.error('Fetch participants error:', error)
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, studentName, studentEmail } = body

    if (!eventId || !studentName || !studentEmail) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Check if already registered
    const existing = await db.participant.findFirst({
      where: { eventId, studentEmail, status: 'REGISTERED' },
    })
    if (existing) {
      return NextResponse.json({ error: 'Already registered for this event' }, { status: 409 })
    }

    // Check capacity
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { participants: { where: { status: 'REGISTERED' } } } } },
    })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    if (event._count.participants >= event.capacity) {
      return NextResponse.json({ error: 'Event is at full capacity' }, { status: 400 })
    }

    const participant = await db.participant.create({
      data: { eventId, studentName, studentEmail },
    })

    return NextResponse.json(participant, { status: 201 })
  } catch (error) {
    console.error('Register participant error:', error)
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }
}
