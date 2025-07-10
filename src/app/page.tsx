// src/app/page.tsx
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs'

export default function Home() {
  return (
    <>
      <SignedIn>
        <main className="min-h-screen p-10 bg-gray-50 text-black">
          <h1 className="text-2xl font-bold mb-4">🔐 MeshLockr Admin Dashboard</h1>
          <p>You&#39;re signed in and ready to manage access policies and logs.</p>
        </main>
      </SignedIn>

      <SignedOut>
        <main className="min-h-screen p-10 flex items-center justify-center">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </main>
      </SignedOut>
    </>
  )
}
