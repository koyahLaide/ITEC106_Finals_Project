import { create } from 'zustand'

export type PageName =
  | 'home'
  | 'about'
  | 'events'
  | 'login'
  | 'register'
  | 'admin-dashboard'
  | 'admin-events'
  | 'admin-participants'
  | 'admin-attendance'
  | 'student-events'
  | 'student-registered'
  | 'student-feedback'

export interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AppState {
  currentPage: PageName
  user: User | null
  setPage: (page: PageName) => void
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'home',
  user: null,
  setPage: (page) => set({ currentPage: page }),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, currentPage: 'home' }),
}))
