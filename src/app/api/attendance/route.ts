import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId')

  if (!eventId) {
    return NextResponse.json({ error: 'eventId required' }, { status: 400 })
  }

  try {
    const participants = await db.participant.findMany({
      where: { eventId, status: 'REGISTERED' },
      orderBy: { registeredAt: 'asc' },
    })

    const total = participants.length
    const checkedIn = participants.filter((p) => p.checkedIn).length
    const pending = total - checkedIn

    return NextResponse.json({ participants, stats: { total, checkedIn, pending } })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { eventId, code } = await req.json()

    if (!eventId || !code) {
      return NextResponse.json({ error: 'eventId and code are required' }, { status: 400 })
    }

    const normalizedCode = code.trim().toLowerCase()

    const participants = await db.participant.findMany({
      where: { eventId, status: 'REGISTERED' },
    })

    const participant = participants.find(
      (p) =>
        p.id.toLowerCase().endsWith(normalizedCode) ||
        p.id.toLowerCase() === normalizedCode
    )

    if (!participant) {
      return NextResponse.json(
        { error: 'Registration code not found for this event' },
        { status: 404 }
      )
    }

    if (participant.checkedIn) {
      return NextResponse.json(
        { error: `${participant.studentName} is already checked in`, alreadyCheckedIn: true, participant },
        { status: 409 }
      )
    }

    const updated = await db.participant.update({
      where: { id: participant.id },
      data: { checkedIn: true, checkedInAt: new Date() },
    })

    return NextResponse.json({ success: true, participant: updated })
  } catch {
    return NextResponse.json({ error: 'Check-in failed' }, { status: 500 })
  }
}
