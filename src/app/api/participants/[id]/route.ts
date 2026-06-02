import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const participant = await db.participant.update({
      where: { id },
      data: { status: body.status },
    })
    return NextResponse.json(participant)
  } catch (error) {
    console.error('Update participant error:', error)
    return NextResponse.json({ error: 'Failed to update participant' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.participant.delete({ where: { id } })
    return NextResponse.json({ message: 'Participant removed successfully' })
  } catch (error) {
    console.error('Delete participant error:', error)
    return NextResponse.json({ error: 'Failed to remove participant' }, { status: 500 })
  }
}
