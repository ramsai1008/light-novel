'use client'

import { useState } from "react"
import { db, storage } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CreateNovelForm() {
  const [title, setTitle] = useState("")
  const [cover, setCover] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!title || !cover) {
      alert("Please provide title and cover")
      return
    }

    setLoading(true)

    // 1. Create novel doc
    const novelRef = await addDoc(collection(db, "novels"), {
      title,
      createdAt: serverTimestamp(),
    })

    // 2. Upload cover
    const coverRef = ref(storage, `covers/${novelRef.id}.jpg`)
    await uploadBytes(coverRef, cover)
    const coverUrl = await getDownloadURL(coverRef)

    // 3. Update doc with coverUrl
    await novelRef.update({
      coverUrl,
    })

    alert("Novel created!")
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
      <Button disabled={loading} onClick={handleSubmit}>
        {loading ? "Creating..." : "Create Novel"}
      </Button>
    </div>
  )
}
