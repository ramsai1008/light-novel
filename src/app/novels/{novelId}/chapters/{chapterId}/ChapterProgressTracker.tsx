"use client";
import { useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ChapterProgressTracker({ novelId, chapterId }: { novelId: string; chapterId: string }) {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      await setDoc(
        doc(db, `users/${user.uid}/reading/${novelId}`),
        {
          chapterId,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });
    return () => unsub();
  }, [novelId, chapterId]);
  return null;
}
