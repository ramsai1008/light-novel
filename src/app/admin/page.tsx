'use client'

import AdminGuard from '@/components/auth/AdminGuard'
// ...rest of your imports

export default function AdminPageWrapper() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  )
}
