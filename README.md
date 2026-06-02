# CvSU Campus Event Management System

A web-based Campus Event Management System built for **Cavite State University** as an **ITEC 106 - Web Systems and Technologies 2 Final Project**.

## Features

### Public Pages
- **Home Page** — Hero section with stats cards and featured events
- **About Page** — System overview and technology stack info
- **Events Page** — Browse all events with search and status filter (Upcoming/Ongoing/Completed)

### Admin/Organizer Pages
- **Dashboard** — Stats cards (total events, participants, upcoming) + bar chart of participants per event
- **Event Management** — Full CRUD: Create, Edit, Delete events via modal dialog
- **Participant Management** — View all registrations, filter by event, cancel/remove participants

### Student Pages
- **Browse Events** — View events and register (no account needed — just name + email)
- **My Registrations** — Look up registrations by email and cancel participation

### Unique Features
- **QR Code Registration** — Each registration generates a unique UUID confirmation code
- **Real-time Capacity Tracking** — Progress bars showing participants vs capacity
- **Search & Filter** — Filter events by status, search by title

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | Full-stack React framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | UI component library |
| **Prisma ORM** | Database management |
| **MySQL** | Relational database |
| **bcryptjs** | Password hashing |
| **Zustand** | Client state management |
| **Recharts** | Dashboard charts |

---

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v18 or higher) — [Download here](https://nodejs.org/)
2. **MySQL Server** (v5.7+ or v8.0+) — [Download here](https://dev.mysql.com/downloads/)
3. **npm** or **yarn** or **bun** (comes with Node.js)
4. A MySQL client (phpMyAdmin, MySQL Workbench, or MySQL CLI)

---

## Setup Instructions

### Step 1: Create the MySQL Database

Open your MySQL client (MySQL CLI, phpMyAdmin, or MySQL Workbench) and run:

**Option A: Using the provided SQL file**
```bash
mysql -u root -p < database.sql
```

**Option B: Manual creation**
```sql
CREATE DATABASE cvsu_events CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Configure Environment Variables

Copy the example environment file and edit it with your MySQL credentials:

```bash
cp .env.example .env
```

Open `.env` and update the connection string:

```env
DATABASE_URL="mysql://YOUR_USERNAME:YOUR_PASSWORD@localhost:3306/cvsu_events"
```

**Examples:**
```env
# If your MySQL password is empty:
DATABASE_URL="mysql://root@localhost:3306/cvsu_events"

# If your MySQL password is "mypassword":
DATABASE_URL="mysql://root:mypassword@localhost:3306/cvsu_events"

# If using XAMPP (username: root, no password):
DATABASE_URL="mysql://root@localhost:3306/cvsu_events"
```

### Step 3: Install Dependencies

```bash
npm install
```

> If using bun: `bun install`
> If using yarn: `yarn install`

### Step 4: Generate Prisma Client & Push Schema

```bash
# Generate the Prisma client
npx prisma generate

# Create tables in MySQL
npx prisma db push
```

> This will create the `User`, `Event`, and `Participant` tables in your MySQL database.

### Step 5: Seed the Database

```bash
node scripts/seed.js
```

> This creates a default admin account and sample data.

### Step 6: Run the Development Server

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

---

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@cvsu.edu.ph` | `admin123` |

---

## Project Structure

```
cvsu-event-management-system/
├── prisma/
│   └── schema.prisma          # Database schema (MySQL)
├── scripts/
│   └── seed.js                # Database seeder
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main SPA entry point
│   │   ├── globals.css        # Global styles (Tailwind)
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   ├── register/route.ts
│   │       │   └── logout/route.ts
│   │       ├── events/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── participants/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       └── seed/route.ts
│   ├── components/
│   │   ├── navbar.tsx         # Navigation bar
│   │   ├── footer.tsx         # Footer
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── store.ts           # Zustand state management
│   │   └── utils.ts           # Utility functions
│   ├── pages/
│   │   ├── HomePage.tsx       # Public landing page
│   │   ├── AboutPage.tsx      # About the system
│   │   ├── EventsPage.tsx     # Public event listing
│   │   ├── LoginPage.tsx      # Admin login
│   │   ├── RegisterPage.tsx   # Admin registration
│   │   ├── admin/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── EventManagementPage.tsx
│   │   │   └── ParticipantManagementPage.tsx
│   │   └── student/
│   │       ├── StudentEventsPage.tsx
│   │       └── MyRegistrationsPage.tsx
│   └── hooks/
├── public/
├── .env.example               # Environment template
├── database.sql               # MySQL database creation
├── package.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(30) | Unique ID (cuid) |
| email | VARCHAR(255) | Login email (unique) |
| name | VARCHAR(255) | Full name |
| password | VARCHAR(255) | Hashed password (bcrypt) |
| role | VARCHAR(20) | ADMIN or STUDENT |
| createdAt | DATETIME | Creation timestamp |
| updatedAt | DATETIME | Last update timestamp |

### Events Table
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(30) | Unique ID |
| title | VARCHAR(255) | Event title |
| description | TEXT | Event description |
| date | VARCHAR(20) | Event date |
| time | VARCHAR(20) | Event time |
| location | VARCHAR(255) | Venue |
| capacity | INT | Max participants |
| status | VARCHAR(20) | UPCOMING/ONGOING/COMPLETED/CANCELLED |
| organizerId | VARCHAR(30) | Foreign key to User |
| createdAt | DATETIME | Creation timestamp |
| updatedAt | DATETIME | Last update timestamp |

### Participants Table
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(30) | Unique registration code |
| eventId | VARCHAR(30) | Foreign key to Event |
| studentName | VARCHAR(255) | Student full name |
| studentEmail | VARCHAR(255) | Student email |
| status | VARCHAR(20) | REGISTERED or CANCELLED |
| registeredAt | DATETIME | Registration timestamp |

---

## Common Issues

### "Access denied for user" Error
Make sure your MySQL credentials in `.env` are correct. Check your MySQL username and password.

### "Unknown database 'cvsu_events'" Error
Run the database creation step first:
```bash
mysql -u root -p < database.sql
```

### "prisma:command not found" Error
Install Prisma CLI globally:
```bash
npm install -g prisma
```
Or use npx:
```bash
npx prisma db push
```

### Port 3000 already in use
Kill the existing process or use a different port:
```bash
# Kill port 3000 process (Windows)
npx kill-port 3000

# Or start on a different port
npx next dev -p 3001
```

---

## Using phpMyAdmin / MySQL Workbench

You can also manage the database using a GUI tool:

1. Open phpMyAdmin or MySQL Workbench
2. Create a new database called `cvsu_events`
3. Set collation to `utf8mb4_unicode_ci`
4. Update your `.env` file with the correct credentials
5. Run `npx prisma db push` to create tables
6. Run `node scripts/seed.js` to insert sample data

---

## Credits

- **Course:** ITEC 106 - Web Systems and Technologies 2
- **University:** Cavite State University
- **Campus:** Don Severino delas Alas Campus, Indang, Cavite
- **College:** College of Engineering and Information Technology

---

## License

This project is created for educational purposes as part of the ITEC 106 Final Project.
