import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";

import Link from "next/link";

// This must be a Client Component to use window.confirm and location.reload
"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [novels, setNovels] = useState<any[]>([]);

  useEffect(() => {
    async function fetchNovels() {
      const novelsSnap = await getDocs(collection(db, "novels"));
      const novels = await Promise.all(
        novelsSnap.docs.map(async (novelDoc) => {
          const novel = novelDoc.data();
          const chaptersSnap = await getDocs(
            query(
              collection(db, `novels/${novelDoc.id}/chapters`),
              orderBy("createdAt", "asc")
            )
          );
          const chapters = chaptersSnap.docs.map((c) => ({
            id: c.id,
            title: c.data().title,
          }));
          return {
            id: novelDoc.id,
            title: novel.title,
            coverUrl: novel.coverUrl || "",
            chapters,
          };
        })
      );
      setNovels(novels);
    }
    fetchNovels();
  }, []);
  // Removed duplicate fetching logic. Data is now loaded via useEffect and useState.

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📘 Admin Dashboard</h1>

      <Link
        href="/novels/new"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ➕ Add New Novel
      </Link>

      <div className="space-y-8">
        {novels.map((novel) => (
          <div key={novel.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{novel.title}</h2>
              <button
                onClick={async () => {
                  const confirm = window.confirm(
                    "Delete this novel and all its chapters?"
                  );
                  if (!confirm) return;

                  // 1. Delete all chapters
                  const chaptersSnap = await getDocs(
                    collection(db, `novels/${novel.id}/chapters`)
                  );
                  for (const c of chaptersSnap.docs) {
                    await deleteDoc(c.ref);
                  }

                  // 2. Delete novel itself
                  await deleteDoc(doc(db, "novels", novel.id));
                  location.reload();
                }}
                className="text-red-600 hover:underline ml-2"
              >
                🗑️ Delete Novel
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {novel.chapters.map((chapter: any) => (
                <div key={chapter.id} className="flex items-center border px-2 py-1 rounded">
                  <Link
                    href={`/novels/${novel.id}/chapters/${chapter.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {chapter.title}
                  </Link>
                  <button
                    onClick={async () => {
                      const confirmDelete = window.confirm("Delete this chapter?");
                      if (!confirmDelete) return;
                      await deleteDoc(doc(db, `novels/${novel.id}/chapters/${chapter.id}`));
                      location.reload();
                    }}
                    className="text-red-600 hover:underline ml-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
