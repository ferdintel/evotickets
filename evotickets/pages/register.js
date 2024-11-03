// pages/register.js
import { useState } from 'react';
import Parse from '../lib/parse';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    const user = new Parse.User();
    user.set('username', username);
    user.set('password', password);

    try {
      await user.signUp();
      router.push('/dashboard');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleRegister}>
        <h2 className="text-xl mb-4">Register</h2>
        <input
          className="w-full mb-2 p-2 border rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-green-500 text-white p-2 rounded" type="submit">
          Register
        </button>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
