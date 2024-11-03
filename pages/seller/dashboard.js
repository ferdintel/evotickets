
import { useEffect, useState } from 'react';
import Parse from '../../utils/parseConfig';
import withAuth from '../../utils/withAuth';
import QRCodeScanner from '../../components/QRCodeScanner';

function SellerDashboard() {
  const [tickets, setTickets] = useState([]);
  const [scannedCode, setScannedCode] = useState('');
  const [ticketDetails, setTicketDetails] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
        const currentUser = Parse.User.current();
      
    
        const eventsRelation = currentUser.relation('events');
        const eventsQuery = eventsRelation.query();
        const userEvents = await eventsQuery.find();
      
        const Ticket = Parse.Object.extend('Ticket');
        const query = new Parse.Query(Ticket);
        query.equalTo('seller', currentUser);
        query.containedIn('event', userEvents);
        query.include('event');
        const results = await query.find();
        setTickets(results);
      };
      

    fetchTickets();
  }, []);

  const handleScan = async (code) => {
    setScannedCode(code);
    const Ticket = Parse.Object.extend('Ticket');
    const query = new Parse.Query(Ticket);
    query.equalTo('code', code);
    query.include('event');
    const ticket = await query.first();
    if (ticket) {
      const ticketEvent = ticket.get('event');
      const isAuthorized = userEvents.some(
        (event) => event.id === ticketEvent.id
      );
      if (isAuthorized) {
        setTicketDetails(ticket);
      } else {
        alert('You are not authorized to activate tickets for this event.');
      }
    } else {
      alert('Ticket not found.');
    }
  };

  const activateTicket = async () => {
    if (ticketDetails) {
      ticketDetails.set('status', 'Active');
      ticketDetails.set('seller', Parse.User.current());
      await ticketDetails.save();
      alert('Ticket activated successfully.');
      setTicketDetails(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Seller Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-xl mb-2">Scan Ticket to Activate</h2>
        <QRCodeScanner onScan={handleScan} />
      </div>

      {ticketDetails && (
        <div className="mb-6">
          <h2 className="text-xl mb-2">Ticket Details</h2>
          <p>Code: {ticketDetails.get('code')}</p>
          <p>Event: {ticketDetails.get('event').get('name')}</p>
          <p>Current Status: {ticketDetails.get('status')}</p>
          <button
            onClick={activateTicket}
            className="bg-green-500 text-white p-2 mt-2"
          >
            Activate Ticket
          </button>
        </div>
      )}

      <div>
        <h2 className="text-xl mb-2">My Activated Tickets</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Code</th>
              <th className="border p-2">Event</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="border p-2">{ticket.get('code')}</td>
                <td className="border p-2">
                  {ticket.get('event').get('name')}
                </td>
                <td className="border p-2">{ticket.get('status')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuth(SellerDashboard, ['Seller']);