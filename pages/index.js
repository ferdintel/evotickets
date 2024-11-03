import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Parse from '../lib/parse';
import Image from 'next/image'

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const currentUser = Parse.User.current();
    
    if (currentUser) {
      // If the user is logged in, redirect to the dashboard
      router.push('/dashboard');
    } else {
      // If the user is not logged in, redirect to the register page
      router.push('/login');
    }
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center"  >
      {/* Optionally, you can display a loading message while redirecting */}
      <Image
      src="/logo-evotickets-dark.png"
      width={200}
      height={200}
      alt="Picture of the author"
    />
    </div>
  );
}
