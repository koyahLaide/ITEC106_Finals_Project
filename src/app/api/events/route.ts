import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const events = await db.event.findMany({
      include: {
        organizer: { select: { name: true } },
        _count: { select: { participants: { where: { status: 'REGISTERED' } } } },
      },
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error('Fetch events error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, time, location, capacity, status, organizerId } = body

    if (!title || !date || !time || !location || !organizerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const event = await db.event.create({
      data: {
        title,
        description: description || '',
        date,
        time,
        location,
        capacity: capacity || 100,
        status: status || 'UPCOMING',
        organizerId,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
