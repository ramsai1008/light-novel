
'use client'

import AdminGuard from '@/components/auth/AdminGuard'
import CreateNovelForm from '@/components/admin/CreateNovelForm'

export default function NewNovelPage() {
  return (
    <AdminGuard>
      <CreateNovelForm />
    </AdminGuard>
  )
}
