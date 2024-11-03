// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to Evotickets</h1>
      <p className="text-lg mb-6 text-center">
        Manage your events and ticket sales with ease.
      </p>
      <div className="flex space-x-4">
        <Link href="/login">
          Login
        </Link>
        <Link href="/register">
          Register
        </Link>
      </div>
    </div>
  );
}
