'use client'

import { useState } from 'react'
import { db, storage } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function CreateNovelForm() {
  const [title, setTitle] = useState('')
  const [cover, setCover] = useState<File | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async () => {
    if (!title || !cover) return alert('Title and cover are required')
    setLoading(true)

    // 1. Create novel
    const novelRef = await addDoc(collection(db, 'novels'), {
      title,
      tags,
      createdAt: serverTimestamp(),
    })

    // 2. Upload cover
    const coverRef = ref(storage, `covers/${novelRef.id}.jpg`)
    await uploadBytes(coverRef, cover)
    const coverUrl = await getDownloadURL(coverRef)

    // 3. Update doc with cover URL
    await updateDoc(doc(db, 'novels', novelRef.id), { coverUrl })

    alert('Novel created!')
    router.push(`/novels/${novelRef.id}`)
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">📘 Add New Novel</h1>

      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Novel Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCover(e.target.files?.[0] || null)}
      />

      {/* Genre/Tag Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            className="border p-2 flex-1"
            placeholder="Add genre (e.g. Action)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag}>➕ Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm flex items-center"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <Button disabled={loading} onClick={handleSubmit}>
        {loading ? 'Creating...' : 'Create Novel'}
      </Button>
    </div>
  )
}
