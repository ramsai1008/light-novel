'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login')
        return
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const isAdmin = userDoc.exists() && userDoc.data().isAdmin === true

      if (!isAdmin) {
        router.replace('/') // redirect if not admin
      } else {
        setAuthorized(true)
      }

      setLoading(false)
    })

    return () => unsub()
  }, [router])

  if (loading) return <div className="p-6">Checking admin access...</div>
  if (!authorized) return null

  return <>{children}</>
}
