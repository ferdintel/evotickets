// pages/manageTickets.js
import { useState } from 'react';
import Parse from '../utils/parseConfig';
import { useRouter } from 'next/router';

export default function ManageTickets() {
  const [ticketCode, setTicketCode] = useState('');
  const [eventId, setEventId] = useState('');
  const router = useRouter();

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const Ticket = Parse.Object.extend('Ticket');
      const newTicket = new Ticket();
      newTicket.set('code', ticketCode);
      newTicket.set('event', { __type: 'Pointer', className: 'Event', objectId: eventId });
      newTicket.set('status', 'Valid'); // Set initial status to Valid

      await newTicket.save();
      alert('Ticket created successfully!');
      router.push('/dashboard'); // Redirect to User Dashboard
    } catch (error) {
      alert('Error creating ticket: ' + error.message);
      console.error('Error while creating ticket', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleCreateTicket}>
        <h2 className="text-2xl mb-4">Create New Ticket</h2>
        <input
          type="text"
          placeholder="Ticket Code"
          className="border p-2 w-full mb-4"
          value={ticketCode}
          onChange={(e) => setTicketCode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Event ID"
          className="border p-2 w-full mb-4"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Create Ticket
        </button>
      </form>
    </div>
  );
}
