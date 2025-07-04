'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import Link from 'next/link'

type Novel = {
  id: string
  title: string
  coverUrl?: string
  tags?: string[]
}

export default function GenresPage() {
  const [novels, setNovels] = useState<Novel[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [genres, setGenres] = useState<string[]>([])

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'novels'))
      const all = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Novel[]

      setNovels(all)

      // extract unique genres
      const tagsSet = new Set<string>()
      all.forEach((novel) =>
        novel.tags?.forEach((tag) => tagsSet.add(tag))
      )
      setGenres(Array.from(tagsSet))
    }

    fetch()
  }, [])

  const filtered = selected
    ? novels.filter((n) => n.tags?.includes(selected))
    : []

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🏷 Browse by Genre</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelected(genre)}
            className={`px-3 py-1 rounded border ${
              selected === genre ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {selected && (
        <>
          <h2 className="text-xl font-semibold mb-2">
            📚 Novels in “{selected}”
          </h2>
          {filtered.length === 0 ? (
            <p>No novels found in this genre.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filtered.map((novel) => (
                <Link
                  key={novel.id}
                  href={`/novels/${novel.id}`}
                  className="border rounded p-2 hover:bg-gray-50"
                >
                  {novel.coverUrl ? (
                    <img
                      src={novel.coverUrl}
                      alt={novel.title}
                      className="w-full h-40 object-cover mb-2 rounded"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 mb-2 rounded" />
                  )}
                  <h3 className="text-sm font-semibold">{novel.title}</h3>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
