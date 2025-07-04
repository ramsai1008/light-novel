'use client'

import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddNovelPage() {
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState<File | null>(null);

  const handleSubmit = async () => {
    let coverUrl = '';
    if (cover) {
      const storageRef = ref(storage, `covers/${cover.name}`);
      await uploadBytes(storageRef, cover);
      coverUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'novels'), {
      title,
      coverUrl,
      createdAt: new Date(),
    });
    alert('Novel Added!');
  };

  return (
    <div className="p-4 space-y-4">
      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input type="file" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />
      <Button onClick={handleSubmit}>Add Novel</Button>
    </div>
  );
}
