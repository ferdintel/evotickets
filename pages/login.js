// pages/login.js
import { useState } from 'react';
import Parse from '../lib/parse';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image'

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await Parse.User.logIn(username, password);
      router.push('/dashboard');
    } catch (error) {
      alert('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white flex flex-col justify-center items-center  p-8 rounded-xl shadow-xl" onSubmit={handleLogin}>
      <Image
      src="/logo-evotickets-dark.png"
      width={200}
      height={200}
      alt="Picture of the author"
    />
        <h2 className="text-xl mb-4 mt-4">Connecter-vous</h2>
        <input
          className="w-full mb-2 p-4 border rounded-xl"
          type="text"
          placeholder="Adresse e-mail"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full mb-4 p-4 border rounded-xl"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-[#20073b] font-semibold text-white p-4 rounded-xl" type="submit">
          Se connecter
        </button>
        <p className="mt-4 text-center">
          Vous n'avez pas de compte?{' '}
          <Link className="font-bold" href="/register">
            Créez un compte
          </Link>
        </p>
      </form>
    </div>
  );
}
