'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore'

export default function AdminStats() {
  const [novels, setNovels] = useState(0)
  const [chapters, setChapters] = useState(0)
  const [users, setUsers] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      // Count novels
      const novelSnap = await getDocs(collection(db, 'novels'))
      setNovels(novelSnap.size)

      // Count chapters across all novels
      let totalChapters = 0
      for (const novel of novelSnap.docs) {
        const chaptersSnap = await getDocs(collection(db, `novels/${novel.id}/chapters`))
        totalChapters += chaptersSnap.size
      }
      setChapters(totalChapters)

      // Count users
      const usersSnap = await getDocs(collection(db, 'users'))
      setUsers(usersSnap.size)

      setLoading(false)
    }

    loadStats()
  }, [])

  if (loading) return <div className="p-4">📊 Loading stats...</div>

  return (
    <div className="p-4 border rounded space-y-2">
      <h2 className="text-xl font-bold">📊 Site Stats</h2>
      <p>📚 Total Novels: <strong>{novels}</strong></p>
      <p>📄 Total Chapters: <strong>{chapters}</strong></p>
      <p>👤 Total Users: <strong>{users}</strong></p>
    </div>
  )
}
