'use client'

import AdminDashboard from './AdminDashboard'
import AdminGuard from '@/components/auth/AdminGuard'

export default function AdminPageWrapper() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  )
}
