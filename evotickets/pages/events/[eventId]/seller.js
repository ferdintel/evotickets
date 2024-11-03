// pages/events/[eventId]/seller.js
import { useEffect, useState } from 'react';
import Parse from '../../../lib/parse';
import { useRouter } from 'next/router';

export default function SellerDashboard() {
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
    ticketQuery.equalTo('status', 'Valid');
    try {
      const tickets = await ticketQuery.find();
      setTickets(tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const activateTicket = async (ticket) => {
    ticket.set('status', 'Active');
    try {
      await ticket.save();
      fetchTickets();
    } catch (error) {
      console.error('Error activating ticket:', error);
    }
  };

  return (
    <div className="p-6">
      {event && (
        <>
          <h1 className="text-2xl mb-4">Seller Dashboard: {event.get('name')}</h1>
          <h2 className="text-xl mb-4">Valid Tickets</h2>
          {tickets.length > 0 ? (
            <ul>
              {tickets.map((ticket) => (
                <li key={ticket.id} className="mb-2">
                  Code: {ticket.get('code')}
                  <button
                    className="bg-blue-500 text-white p-1 rounded ml-2"
                    onClick={() => activateTicket(ticket)}
                  >
                    Activate
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No valid tickets available.</p>
          )}
        </>
      )}
    </div>
  );
}
