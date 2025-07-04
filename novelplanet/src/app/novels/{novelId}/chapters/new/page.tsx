'use client'

import AdminGuard from '@/components/auth/AdminGuard'
import CreateChapterForm from '@/components/admin/CreateChapterForm'

export default function NewChapterPage() {
  return (
    <AdminGuard>
      <CreateChapterForm />
    </AdminGuard>
  )
}
