'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from '@/components/ui/button'

export default function EditChapterPage() {
  const { novelId, chapterId } = useParams() as {
    novelId: string
    chapterId: string
  }
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Loading...</p>',
  })

  useEffect(() => {
    const loadChapter = async () => {
      const ref = doc(db, `novels/${novelId}/chapters`, chapterId)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data()
        setTitle(data.title)
        editor?.commands.setContent(data.content)
        setLoading(false)
      }
    }
    if (editor) loadChapter()
  }, [editor, novelId, chapterId])

  const handleUpdate = async () => {
    if (!editor) return
    const content = editor.getHTML()

    await updateDoc(doc(db, `novels/${novelId}/chapters`, chapterId), {
      title,
      content,
      updatedAt: serverTimestamp(),
    })

    alert('Chapter updated!')
    router.push(`/novels/${novelId}/chapters/${chapterId}`)
  }

  if (loading || !editor) return <div className="p-4">Loading editor...</div>

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Chapter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="border rounded p-2 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
      <Button onClick={handleUpdate}>Save Changes</Button>
    </div>
  )
}
