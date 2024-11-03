import { useState } from 'react';
import Parse from '../lib/parse';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    user.set('firstName', firstName); 
    user.set('lastName', lastName); 

    try {
      await user.signUp();
      router.push('/dashboard');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white flex flex-col justify-center items-center p-8 rounded-xl shadow-xl" onSubmit={handleRegister}>
        <Image
          src="/logo-evotickets-dark.png"
          width={200}
          height={200}
          alt="Evotickets logo"
        />
        <h2 className="text-xl mb-4 mt-4">Inscription</h2>
        <input
          className="w-full mb-2 p-4 border rounded-xl"
          type="text"
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          className="w-full mb-2 p-4 border rounded-xl"
          type="text"
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          className="w-full mb-2 p-4 border rounded-xl"
          type="text"
          placeholder="Adresse e-mail"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full mb-2 p-4 border rounded-xl"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="w-full mb-2 p-4 border rounded-xl"
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="w-full bg-[#20073b] font-semibold text-white p-4 mt-2 rounded-xl" type="submit">
          Créez un compte
        </button>
        <p className="mt-4 text-center">
          Vous avez déjà un compte?{' '}
          <Link className="font-bold" href="/login">
            Connectez-vous
          </Link>
        </p>
      </form>
    </div>
  );
}
