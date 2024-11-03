import { useState } from 'react';
import QRCodeScanner from '../components/QRCodeScanner';
import Parse from '../utils/parseConfig';

export default function CheckTicket() {
  const [scannedCode, setScannedCode] = useState('');
  const [ticketDetails, setTicketDetails] = useState(null);

  const handleScan = async (code) => {
    setScannedCode(code);
    const Ticket = Parse.Object.extend('Ticket');
    const query = new Parse.Query(Ticket);
    query.equalTo('code', code);
    query.include('event');
    const ticket = await query.first();
    if (ticket) {
      setTicketDetails(ticket);
    } else {
      alert('Ticket not found.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Check Ticket Status</h1>

      <div className="mb-6">
        <QRCodeScanner onScan={handleScan} />
      </div>

      {ticketDetails && (
        <div>
          <h2 className="text-xl mb-2">Ticket Details</h2>
          <p>Code: {ticketDetails.get('code')}</p>
          <p>Event: {ticketDetails.get('event').get('name')}</p>
          <p>Status: {ticketDetails.get('status')}</p>
        </div>
      )}
    </div>
  );
}
