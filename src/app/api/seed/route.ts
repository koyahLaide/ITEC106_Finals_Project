import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Check if already seeded
    const existingAdmin = await db.user.findFirst({ where: { email: 'admin@cvsu.edu.ph' } })
    if (existingAdmin) {
      return NextResponse.json({ message: 'Already seeded' })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await db.user.create({
      data: {
        email: 'admin@cvsu.edu.ph',
        name: 'System Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    // Create sample events
    const events = await Promise.all([
      db.event.create({
        data: {
          title: 'ITEC 106 - Software Engineering Seminar',
          description: 'A comprehensive seminar covering modern software engineering practices, agile methodologies, and DevOps fundamentals. Open to all ITEC students.',
          date: '2025-07-15',
          time: '09:00 AM',
          location: 'CvSU Main Campus, IT Building, Room 301',
          capacity: 150,
          status: 'UPCOMING',
          organizerId: admin.id,
        },
      }),
      db.event.create({
        data: {
          title: 'Annual Programming Competition 2025',
          description: 'Showcase your programming skills in this annual competition. Teams of 3 will compete in algorithmic challenges using C++, Java, and Python.',
          date: '2025-07-20',
          time: '01:00 PM',
          location: 'CvSU Main Campus, Computer Lab 201',
          capacity: 60,
          status: 'UPCOMING',
          organizerId: admin.id,
        },
      }),
      db.event.create({
        data: {
          title: 'Web Development Workshop',
          description: 'Hands-on workshop on modern web development with React, Next.js, and Tailwind CSS. Bring your laptops!',
          date: '2025-06-28',
          time: '10:00 AM',
          location: 'CvSU Main Campus, IT Building, Room 202',
          capacity: 80,
          status: 'ONGOING',
          organizerId: admin.id,
        },
      }),
      db.event.create({
        data: {
          title: 'Career Talk: IT Industry Trends',
          description: 'Industry professionals share insights about the latest trends in the IT industry, AI, cybersecurity, and cloud computing.',
          date: '2025-06-15',
          time: '02:00 PM',
          location: 'CvSU Auditorium',
          capacity: 200,
          status: 'COMPLETED',
          organizerId: admin.id,
        },
      }),
    ])

    // Add sample participants
    await Promise.all([
      db.participant.create({
        data: {
          eventId: events[0].id,
          studentName: 'Juan Dela Cruz',
          studentEmail: 'juan.delacruz@cvsu.edu.ph',
          status: 'REGISTERED',
        },
      }),
      db.participant.create({
        data: {
          eventId: events[0].id,
          studentName: 'Maria Santos',
          studentEmail: 'maria.santos@cvsu.edu.ph',
          status: 'REGISTERED',
        },
      }),
      db.participant.create({
        data: {
          eventId: events[1].id,
          studentName: 'Jose Rizal',
          studentEmail: 'jose.rizal@cvsu.edu.ph',
          status: 'REGISTERED',
        },
      }),
      db.participant.create({
        data: {
          eventId: events[2].id,
          studentName: 'Ana Reyes',
          studentEmail: 'ana.reyes@cvsu.edu.ph',
          status: 'REGISTERED',
        },
      }),
      db.participant.create({
        data: {
          eventId: events[2].id,
          studentName: 'Carlos Garcia',
          studentEmail: 'carlos.garcia@cvsu.edu.ph',
          status: 'REGISTERED',
        },
      }),
      db.participant.create({
        data: {
          eventId: events[3].id,
          studentName: 'Sofia Lim',
          studentEmail: 'sofia.lim@cvsu.edu.ph',
          status: 'REGISTERED',
        },
      }),
    ])

    return NextResponse.json({ message: 'Database seeded successfully', adminId: admin.id })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}
