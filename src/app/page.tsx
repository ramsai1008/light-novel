import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import Link from 'next/link'
import { ContinueReading } from '@/components/ContinueReading'

export default async function HomePage() {
  const q = query(collection(db, 'novels'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)

  const novels = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as { id: string; title: string; coverUrl?: string }[]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center">📚 Welcome to NovelPlanet</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {novels.map((novel) => (
          <div key={novel.id} className="border rounded p-2">
            <Link href={`/novels/${novel.id}`}>
              {novel.coverUrl ? (
                <img
                  src={novel.coverUrl}
                  alt={novel.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded mb-2" />
              )}
              <h2 className="text-sm font-semibold">{novel.title}</h2>
            </Link>
            <ContinueReading novelId={novel.id} />
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/library"
          className="inline-block text-blue-600 underline"
        >
          🔍 Browse All Novels
        </Link>
      </div>
    </div>
  )
}
