import { useState } from 'react';
import Parse from '../lib/parse';
import { useRouter } from 'next/router';

export default function CreateEvent() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const Event = Parse.Object.extend('Event');
    const event = new Event();

    event.set('name', name);
    event.set('date', new Date(date));
    event.set('location', location);
    event.set('manager', Parse.User.current());

    try {
      await event.save();

      const RoleAssignment = Parse.Object.extend('RoleAssignment');
      const roleAssignment = new RoleAssignment();
      roleAssignment.set('event', event);
      roleAssignment.set('user', Parse.User.current());
      roleAssignment.set('role', 'Manager');
      await roleAssignment.save();

      router.push('/dashboard');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Create Event</h1>
      <form onSubmit={handleCreateEvent}>
        <input
          className="w-full mb-2 p-2 border rounded"
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          type="date"
          placeholder="Event Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          type="text"
          placeholder="Event Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button className="bg-green-500 text-white p-2 rounded" type="submit">
          Create Event
        </button>
      </form>
    </div>
  );
}
