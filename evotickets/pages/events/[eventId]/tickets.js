// pages/events/[eventId]/tickets.js
import { useEffect, useState } from 'react';
import Parse from '../../../lib/parse';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

export default function ManageTickets() {
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const router = useRouter();
  const { eventId } = router.query;

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchTickets();
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

  const fetchTickets = async () => {
    const Ticket = Parse.Object.extend('Ticket');
    const ticketQuery = new Parse.Query(Ticket);
    const eventPointer = {
      __type: 'Pointer',
      className: 'Event',
      objectId: eventId,
    };
    ticketQuery.equalTo('event', eventPointer);
    try {
      const tickets = await ticketQuery.find();
      setTickets(tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const generateTicket = async () => {
    const Ticket = Parse.Object.extend('Ticket');
    const ticket = new Ticket();
    ticket.set('code', uuidv4());
    ticket.set('status', 'Valid');
    ticket.set('event', event);

    try {
      await ticket.save();
      fetchTickets();
    } catch (error) {
      console.error('Error generating ticket:', error);
    }
  };

  const changeTicketStatus = async (ticket, status) => {
    ticket.set('status', status);
    try {
      await ticket.save();
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  return (
    <div className="p-6">
      {event && (
        <>
          <h1 className="text-2xl mb-4">Manage Tickets for {event.get('name')}</h1>
          <button
            className="bg-blue-500 text-white p-2 rounded mb-4"
            onClick={generateTicket}
          >
            Generate Ticket
          </button>
          {tickets.length > 0 ? (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Code</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="py-2 px-4 border-b">{ticket.get('code')}</td>
                    <td className="py-2 px-4 border-b">{ticket.get('status')}</td>
                    <td className="py-2 px-4 border-b">
                      <select
                        className="border p-1 rounded"
                        value={ticket.get('status')}
                        onChange={(e) => changeTicketStatus(ticket, e.target.value)}
                      >
                        <option value="Valid">Valid</option>
                        <option value="Active">Active</option>
                        <option value="Used">Used</option>
                        <option value="Invalid">Invalid</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No tickets available.</p>
          )}
        </>
      )}
    </div>
  );
}
