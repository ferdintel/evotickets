// pages/events/[eventId]/manage.js
import { useEffect, useState } from 'react';
import Parse from '../../../lib/parse';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ManageEvent() {
  const [event, setEvent] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Seller');
  const router = useRouter();
  const { eventId } = router.query;

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    const Event = Parse.Object.extend('Event');
    const query = new Parse.Query(Event);
    try {
      const event = await query.get(eventId);
      setEvent(event);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    const query = new Parse.Query(Parse.User);
    query.equalTo('username', username);
    try {
      const user = await query.first();
      if (user) {
        const Invitation = Parse.Object.extend('Invitation');
        const invitation = new Invitation();
        invitation.set('event', event);
        invitation.set('user', user);
        invitation.set('role', role);
        invitation.set('status', 'Pending');
        await invitation.save();
        alert('Invitation sent.');
        setUsername('');
      } else {
        alert('User not found.');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      {event && (
        <>
          <h1 className="text-2xl mb-4">Manage Event: {event.get('name')}</h1>
          <form onSubmit={handleInvite} className="mb-6">
            <input
              className="w-full mb-2 p-2 border rounded"
              type="text"
              placeholder="Username to invite"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <select
              className="w-full mb-2 p-2 border rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Seller">Seller</option>
              <option value="Controller">Controller</option>
            </select>
            <button className="bg-blue-500 text-white p-2 rounded" type="submit">
              Send Invitation
            </button>
          </form>

          <h2 className="text-xl mb-4">Event Tickets</h2>
          <Link href={`/events/${eventId}/tickets`}>
            Manage Tickets
          </Link>

          {/* Additional manager functionalities can be added here */}
        </>
      )}
    </div>
  );
}
