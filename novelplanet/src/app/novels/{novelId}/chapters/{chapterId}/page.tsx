import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ChapterPage({
  params,
}: {
  params: { novelId: string; chapterId: string };
}) {
  const { novelId, chapterId } = params;

  const novelRef = doc(db, "novels", novelId);
  const novelSnap = await getDoc(novelRef);
  if (!novelSnap.exists()) notFound();
  const novel = novelSnap.data();

  const chapterRef = doc(db, `novels/${novelId}/chapters`, chapterId);
  const chapterSnap = await getDoc(chapterRef);
  if (!chapterSnap.exists()) notFound();
  const chapter = chapterSnap.data();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-center">{novel.title}</h1>
      <h2 className="text-xl font-semibold text-center">{chapter.title}</h2>
      <hr />
      <div className="flex justify-end">
        <Link
          href={`/novels/${novelId}/chapters/${chapterId}/edit`}
          className="text-sm text-blue-500 hover:underline"
        >
          ✏️ Edit this chapter
        </Link>
      </div>
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: chapter.content }}
      />
    </div>
  );
}
