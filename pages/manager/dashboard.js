// pages/manager/dashboard.js
import { useEffect, useState } from 'react';
import Parse from '../../utils/parseConfig';
import { useRouter } from 'next/router';

export default function ManagerDashboard() {
  const [invitedUsername, setInvitedUsername] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const router = useRouter();

  // Assuming you have code here to fetch events created by the manager

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const currentUser = Parse.User.current();
      const event = await new Parse.Query('Event').get(selectedEventId); // Get the selected event

      const invitation = new Parse.Object('Invitations');
      invitation.set('user', invitedUsername); // Store the invited user's username
      invitation.set('eventId', event.id);
      invitation.set('role', 'Seller'); // Assign a default role

      await invitation.save();
      alert(`Invitation sent to ${invitedUsername}`);
      setInvitedUsername('');
    } catch (error) {
      alert('Error sending invitation: ' + error.message);
    }
  };

  return (
    <div className="p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<div>
<h2 className="text-xl mb-4">Send Invitation</h2>
      <form onSubmit={handleInvite}>
        <input
          type="text"
          placeholder="Username to invite"
          value={invitedUsername}
          onChange={(e) => setInvitedUsername(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Send Invitation</button>
      </form>
</div>
      {/* Event selection and other functionalities */}



      <div className="mt-6">
  <h2 className="text-xl">Manage Tickets</h2>
  <button
    className="bg-blue-500 text-white p-2 mt-2"
    onClick={() => router.push('/manageTickets')}
  >
    Create New Ticket
  </button>
</div>
    </div>
    </div>
  );
}
