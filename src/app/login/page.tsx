'use client'

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push('/');
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Button onClick={login}>Login with Google</Button>
    </div>
  );
}
