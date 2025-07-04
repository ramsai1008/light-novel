'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'

export default function EditNovelForm() {
  const { novelId } = useParams()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchNovel = async () => {
      const snap = await getDoc(doc(db, 'novels', novelId as string))
      if (!snap.exists()) return alert('Novel not found')
      const data = snap.data()
      setTitle(data.title || '')
      setTags(data.tags || [])
      setLoading(false)
    }

    fetchNovel()
  }, [novelId])

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

  const handleSave = async () => {
    setSaving(true)
    await updateDoc(doc(db, 'novels', novelId as string), {
      title,
      tags,
    })
    alert('Novel updated!')
    router.push(`/novels/${novelId}`)
  }

  if (loading) return <p className="p-4">Loading novel...</p>

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">📝 Edit Novel</h1>

      <input
        type="text"
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Genre Editing */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            className="border p-2 flex-1"
            placeholder="Add tag (e.g. Fantasy)"
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

      <Button disabled={saving} onClick={handleSave}>
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}
