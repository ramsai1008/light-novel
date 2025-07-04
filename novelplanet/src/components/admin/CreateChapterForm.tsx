'use client'

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function NewChapterPage() {
  const router = useRouter();
  const { novelId } = useParams() as { novelId: string };
  const [title, setTitle] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your chapter here...</p>",
  });

  const saveChapter = async () => {
    if (!editor || !title) return;

    const content = editor.getHTML();

    await addDoc(collection(db, `novels/${novelId}/chapters`), {
      title,
      content,
      createdAt: serverTimestamp(),
    });

    alert("Chapter saved!");
    router.push(`/novels/${novelId}`);
  };

  return (
    <div className="p-4 space-y-4">
      <input
        type="text"
        placeholder="Chapter Title"
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="border rounded p-2 min-h-[300px]">
        {editor && <EditorContent editor={editor} />}
      </div>

      <Button onClick={saveChapter}>Save Chapter</Button>
    </div>
  );
}
