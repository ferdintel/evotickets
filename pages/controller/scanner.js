// pages/controller/scanner.js
import { useState } from 'react';
import Parse from '../../utils/parseConfig';
import withAuth from '../../utils/withAuth';
import QRCodeScanner from '../../components/QRCodeScanner';

function ControllerScanner() {
  const [scannedCode, setScannedCode] = useState('');
  const [ticketDetails, setTicketDetails] = useState(null);

  const handleScan = async (code) => {
    setScannedCode(code);
    const currentUser = Parse.User.current();
  
    // Get events associated with the user
    const eventsRelation = currentUser.relation('events');
    const eventsQuery = eventsRelation.query();
    const userEvents = await eventsQuery.find();
  
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
        alert('You are not authorized to process tickets for this event.');
      }
    } else {
      alert('Ticket not found.');
    }
  };
  
  const useTicket = async () => {
    if (ticketDetails && ticketDetails.get('status') === 'Active') {
      ticketDetails.set('status', 'Used');
      await ticketDetails.save();
      alert('Ticket marked as used.');
      setTicketDetails(null);
    } else {
      alert('Ticket cannot be marked as used.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Controller Scanner</h1>

      <div className="mb-6">
        <h2 className="text-xl mb-2">Scan Ticket</h2>
        <QRCodeScanner onScan={handleScan} />
      </div>

      {ticketDetails && (
        <div>
          <h2 className="text-xl mb-2">Ticket Details</h2>
          <p>Code: {ticketDetails.get('code')}</p>
          <p>Event: {ticketDetails.get('event').get('name')}</p>
          <p>Current Status: {ticketDetails.get('status')}</p>
          <button
            onClick={useTicket}
            className="bg-green-500 text-white p-2 mt-2"
          >
            Mark as Used
          </button>
        </div>
      )}
    </div>
  );
}

export default withAuth(ControllerScanner, ['Controller']);