
// --- CLIENT COMPONENT: ContinueReading ---
"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { doc as firestoreDoc, getDoc as firestoreGetDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export function ContinueReading({ novelId }: { novelId: string }) {
  const [chapterId, setChapterId] = useState<string | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const snap = await firestoreGetDoc(firestoreDoc(db, `users/${user.uid}/reading/${novelId}`));
      if (snap.exists()) {
        setChapterId(snap.data().chapterId);
      }
    });
  }, [novelId]);

  if (!chapterId) return null;

  return (
    <Link
      href={`/novels/${novelId}/chapters/${chapterId}`}
      className="inline-block mt-2 text-blue-600 underline"
    >
      🔁 Continue Reading
    </Link>
  );
}

import { db } from '@/lib/firebase'
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'
import { notFound } from 'next/navigation'
import ChapterSearch from '@/components/ChapterSearch'

export default async function NovelPage({ params }: { params: { novelId: string } }) {
  const { novelId } = params

  const novelRef = doc(db, 'novels', novelId)
  const novelSnap = await getDoc(novelRef)
  if (!novelSnap.exists()) notFound()

  const novel = novelSnap.data()

  const chapterSnap = await getDocs(
    query(collection(db, `novels/${novelId}/chapters`), orderBy('createdAt'))
  )

  const chapters = chapterSnap.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
  }))

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">{novel.title}</h1>
      <ChapterSearch chapters={chapters} novelId={novelId} />
    </div>
  )
}
