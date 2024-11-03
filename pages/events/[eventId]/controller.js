// pages/events/[eventId]/controller.js
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Parse from '../../../lib/parse';
import { useRouter } from 'next/router';

const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false });

export default function ControllerDashboard() {
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { eventId } = router.query;

  const handleScan = async (data) => {
    if (data) {
      setResult(data);
      try {
        const Ticket = Parse.Object.extend('Ticket');
        const ticketQuery = new Parse.Query(Ticket);
        ticketQuery.equalTo('code', data);
        ticketQuery.include('event');
        const ticket = await ticketQuery.first();
        if (ticket && ticket.get('event').id === eventId) {
          if (ticket.get('status') === 'Active') {
            ticket.set('status', 'Used');
            await ticket.save();
            setMessage('Ticket is valid and has been used.');
          } else if (ticket.get('status') === 'Used') {
            setMessage('Ticket has already been used.');
          } else {
            setMessage('Ticket is not active.');
          }
        } else {
          setMessage('Invalid ticket.');
        }
      } catch (error) {
        console.error('Error processing ticket:', error);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Controller Dashboard</h1>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      <p className="mt-4">Scanned Code: {result}</p>
      <p className="mt-2 text-green-600">{message}</p>
    </div>
  );
}
