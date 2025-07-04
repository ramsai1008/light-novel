'use client'

import { useState } from 'react'
import Link from 'next/link'

type Props = {
  chapters: { id: string; title: string }[]
  novelId: string
}

export default function ChapterSearch({ chapters, novelId }: Props) {
  const [query, setQuery] = useState('')

  const filtered = chapters.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Search chapter title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && (
        <div className="border rounded p-2 max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500">No results found.</p>
          ) : (
            filtered.map((c) => (
              <Link
                key={c.id}
                href={`/novels/${novelId}/chapters/${c.id}`}
                className="block text-blue-600 hover:underline text-sm"
              >
                {c.title}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
