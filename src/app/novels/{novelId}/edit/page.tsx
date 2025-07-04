'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'

export default function EditNovelPage() {
  const { novelId } = useParams() as { novelId: string }
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [newCover, setNewCover] = useState<File | null>(null)

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, 'novels', novelId))
      if (snap.exists()) {
        const data = snap.data()
        setTitle(data.title)
        setCoverUrl(data.coverUrl || '')
      }
    }
    load()
  }, [novelId])

  const handleUpdate = async () => {
    const novelRef = doc(db, 'novels', novelId)

    // Optional: delete old cover
    if (newCover && coverUrl) {
      try {
        const coverPath = decodeURIComponent(
          new URL(coverUrl).pathname.split('/o/')[1].split('?')[0]
        )
        await deleteObject(ref(storage, coverPath))
      } catch (err) {
        console.warn('Old cover deletion failed', err)
      }
    }

    let finalCoverUrl = coverUrl

    // Upload new cover if provided
    if (newCover) {
      const storageRef = ref(storage, `covers/${novelId}.jpg`)
      await uploadBytes(storageRef, newCover)
      finalCoverUrl = await getDownloadURL(storageRef)
    }

    await updateDoc(novelRef, {
      title,
      coverUrl: finalCoverUrl,
    })

    alert('Novel updated!')
    router.push(`/novels/${novelId}`)
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">✏️ Edit Novel</h1>

      <input
        type="text"
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Novel Title"
      />

      <div>
        <p className="font-medium">Current Cover:</p>
        {coverUrl && <img src={coverUrl} alt="cover" className="w-32 h-auto rounded" />}
      </div>

      <div>
        <label className="font-medium">Upload New Cover:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewCover(e.target.files?.[0] || null)}
        />
      </div>

      <Button onClick={handleUpdate}>💾 Save Changes</Button>
    </div>
  )
}
