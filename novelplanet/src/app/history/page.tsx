'use client'

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import Link from "next/link"

interface HistoryItem {
  novelId: string
  novelTitle: string
  novelCover: string
  chapterId: string
  chapterTitle: string
  updatedAt: string
}

export default function ReadingHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return

      const q = query(collection(db, `users/${user.uid}/reading`), orderBy("updatedAt", "desc"))
      const snap = await getDocs(q)

      const items: HistoryItem[] = []

      for (const docSnap of snap.docs) {
        const novelId = docSnap.id
        const { chapterId, updatedAt } = docSnap.data()

        const novelSnap = await getDoc(doc(db, "novels", novelId))
        const chapterSnap = await getDoc(doc(db, `novels/${novelId}/chapters`, chapterId))

        if (!novelSnap.exists() || !chapterSnap.exists()) continue

        items.push({
          novelId,
          novelTitle: novelSnap.data().title,
          novelCover: novelSnap.data().coverUrl || '',
          chapterId,
          chapterTitle: chapterSnap.data().title,
          updatedAt: updatedAt?.toDate().toLocaleString() || '',
        })
      }

      setHistory(items)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="p-6">Loading reading history...</div>
  if (!history.length) return <div className="p-6">No reading history yet.</div>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">📖 Your Reading History</h1>

      {history.map((item) => (
        <div key={item.novelId} className="border p-4 rounded flex items-center gap-4">
          {item.novelCover && (
            <img src={item.novelCover} className="w-16 h-20 object-cover rounded" />
          )}
          <div>
            <h2 className="font-semibold">{item.novelTitle}</h2>
            <p className="text-sm text-gray-500">Last read: {item.chapterTitle}</p>
            <p className="text-xs text-gray-400">At: {item.updatedAt}</p>
            <Link
              href={`/novels/${item.novelId}/chapters/${item.chapterId}`}
              className="text-blue-500 underline text-sm"
            >
              🔁 Continue Reading
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
