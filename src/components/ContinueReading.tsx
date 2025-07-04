'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'

export function ContinueReading({ novelId }: { novelId: string }) {
  const [chapterId, setChapterId] = useState<string | null>(null)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return
      const snap = await getDoc(doc(db, `users/${user.uid}/reading/${novelId}`))
      if (snap.exists()) setChapterId(snap.data().chapterId)
    })
  }, [novelId])

  if (!chapterId) return null

  return (
    <Link
      href={`/novels/${novelId}/chapters/${chapterId}`}
      className="text-blue-500 text-xs underline block mt-1"
    >
      🔁 Continue Reading
    </Link>
  )
}
