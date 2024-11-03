import { useEffect, useState } from 'react';
import Parse from '../utils/parseConfig';
import { useRouter } from 'next/router';

export default function Invitations() {
  const [invitations, setInvitations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchInvitations = async () => {
      const currentUser = Parse.User.current();
      if (!currentUser) {
        alert('You need to be logged in to view your invitations.');
        return router.push('/login');
      }

      // Fetch invitations associated with the user
      const invitationsQuery = new Parse.Query('Invitations'); 
      invitationsQuery.equalTo('user', currentUser);
      const userInvitations = await invitationsQuery.find();

      setInvitations(userInvitations);
    };

    fetchInvitations();
  }, []);

  const handleAcknowledge = async (invitationId, accept) => {
    try {
      const invitation = await new Parse.Query('Invitations').get(invitationId);
      const event = await new Parse.Query('Event').get(invitation.get('eventId')); 

      const roleQuery = new Parse.Query(Parse.Role);
      roleQuery.equalTo('name', invitation.get('role'));
      const role = await roleQuery.first();

      if (accept) {
        // Add user to the event and role
        const eventUsers = event.relation('users');
        eventUsers.add(Parse.User.current());
        await event.save();

        role.getUsers().add(Parse.User.current());
        await role.save();

        alert('Invitation accepted. You are now a part of the event.');
      } else {
        // Optionally, delete the invitation
        await invitation.destroy();
        alert('Invitation declined.');
      }

      // Refresh the invitations
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    } catch (error) {
      alert('Error handling invitation: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl mb-4">Your Invitations</h1>
      {invitations.length > 0 ? (
        <ul className="list-disc pl-6">
          {invitations.map((invitation) => (
            <li key={invitation.id} className="mb-4">
              <span className="font-semibold">Event: {invitation.get('eventName')}</span> - Role: {invitation.get('role')}
              <div className="mt-2">
                <button
                  className="bg-green-500 text-white p-2 mr-2"
                  onClick={() => handleAcknowledge(invitation.id, true)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white p-2"
                  onClick={() => handleAcknowledge(invitation.id, false)}
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending invitations.</p>
      )}
    </div>
  );
}
