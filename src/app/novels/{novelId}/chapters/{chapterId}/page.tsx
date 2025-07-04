import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ChapterPage({
  params,
}: {
  params: { novelId: string; chapterId: string };
}) {
  const { novelId, chapterId } = params;

  // Get novel
  const novelRef = doc(db, "novels", novelId);
  const novelSnap = await getDoc(novelRef);
  if (!novelSnap.exists()) notFound();
  const novel = novelSnap.data();

  // Get all chapters for nav
  const chaptersQuery = query(
    collection(db, `novels/${novelId}/chapters`),
    orderBy("createdAt", "asc")
  );
  const chaptersSnap = await getDocs(chaptersQuery);
  const chapters = chaptersSnap.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
  }));

  // Get current chapter content
  const chapterRef = doc(db, `novels/${novelId}/chapters`, chapterId);
  const chapterSnap = await getDoc(chapterRef);
  if (!chapterSnap.exists()) notFound();
  const chapter = chapterSnap.data();

  // Find current index
  const index = chapters.findIndex((c) => c.id === chapterId);
  const prev = index > 0 ? chapters[index - 1] : null;
  const next = index < chapters.length - 1 ? chapters[index + 1] : null;

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">{novel.title}</h1>
        <h2 className="text-xl font-semibold text-center">{chapter.title}</h2>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: chapter.content }}
        />

        <div className="flex justify-between pt-8">
          {prev ? (
            <Link
              href={`/novels/${novelId}/chapters/${prev.id}`}
              className="text-blue-500 hover:underline"
            >
              ⬅️ {prev.title}
            </Link>
          ) : <span />}

          {next ? (
            <Link
              href={`/novels/${novelId}/chapters/${next.id}`}
              className="text-blue-500 hover:underline"
            >
              {next.title} ➡️
            </Link>
          ) : <span />}
        </div>
      </div>
      {/* Track reading progress on client */}
      <ChapterProgressTracker novelId={novelId} chapterId={chapterId} />
    </>
  );
}

import ChapterProgressTracker from "./ChapterProgressTracker";
