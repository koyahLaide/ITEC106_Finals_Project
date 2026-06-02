import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const event = await db.event.findUnique({
      where: { id },
      include: {
        organizer: { select: { name: true, email: true } },
        participants: { where: { status: 'REGISTERED' } },
      },
    })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    return NextResponse.json(event)
  } catch (error) {
    console.error('Fetch event error:', error)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const event = await db.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        date: body.date,
        time: body.time,
        location: body.location,
        capacity: body.capacity,
        status: body.status,
      },
    })
    return NextResponse.json(event)
  } catch (error) {
    console.error('Update event error:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.event.delete({ where: { id } })
    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Delete event error:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
