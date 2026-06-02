import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { eventId } = await req.json()

    if (!eventId) {
      return NextResponse.json({ error: 'eventId required' }, { status: 400 })
    }

    await db.participant.updateMany({
      where: { eventId },
      data: { checkedIn: false, checkedInAt: null },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 })
  }
}
