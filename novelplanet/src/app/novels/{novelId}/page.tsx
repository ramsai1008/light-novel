import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Chapter {
  id: string;
  title: string;
}

export default async function NovelPage({ params }: { params: { novelId: string } }) {
  const novelId = params.novelId;

  const novelRef = doc(db, "novels", novelId);
  const novelSnap = await getDoc(novelRef);

  if (!novelSnap.exists()) {
    notFound();
  }

  const novel = novelSnap.data();
  const chaptersQuery = query(
    collection(db, `novels/${novelId}/chapters`),
    orderBy("createdAt", "asc")
  );
  const chaptersSnap = await getDocs(chaptersQuery);

  const chapters: Chapter[] = chaptersSnap.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
  }));

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{novel.title}</h1>
        {novel.coverUrl && (
          <img src={novel.coverUrl} alt="Cover" className="mx-auto w-48 rounded-md" />
        )}
        <Link
          href={`/novels/${novelId}/chapters/new`}
          className="text-blue-600 hover:underline"
        >
          ➕ Add New Chapter
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Chapters</h2>
        <ul className="space-y-2">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <Link
                href={`/novels/${novelId}/chapters/${chapter.id}`}
                className="text-blue-500 hover:underline"
              >
                {chapter.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
