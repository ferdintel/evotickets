// pages/dashboard.js
import { useEffect, useState } from 'react';
import Parse from '../lib/parse';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      router.push('/login');
    } else {
      fetchEvents();
      fetchInvitations();
    }
  }, []);

  const fetchEvents = async () => {
    const currentUser = Parse.User.current();
    // Query RoleAssignment where user is current user
    const RoleAssignment = Parse.Object.extend('RoleAssignment');
    const roleQuery = new Parse.Query(RoleAssignment);
    roleQuery.equalTo('user', currentUser);
    roleQuery.include('event');
    try {
      const roleAssignments = await roleQuery.find();
      const associatedEvents = roleAssignments.map((assignment) => assignment.get('event'));
      setEvents(associatedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchInvitations = async () => {
    const currentUser = Parse.User.current();
    const Invitation = Parse.Object.extend('Invitation');
    const invitationQuery = new Parse.Query(Invitation);
    invitationQuery.equalTo('user', currentUser);
    invitationQuery.equalTo('status', 'Pending');
    invitationQuery.include('event');
    try {
      const invitations = await invitationQuery.find();
      setInvitations(invitations);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const handleLogout = async () => {
    await Parse.User.logOut();
    router.push('/login');
  };

  const handleAcceptInvitation = async (invitation) => {
    try {
      // Create a RoleAssignment
      const RoleAssignment = Parse.Object.extend('RoleAssignment');
      const roleAssignment = new RoleAssignment();
      roleAssignment.set('event', invitation.get('event'));
      roleAssignment.set('user', Parse.User.current());
      roleAssignment.set('role', invitation.get('role'));
      await roleAssignment.save();

      // Update invitation status
      invitation.set('status', 'Accepted');
      await invitation.save();

      // Refresh data
      fetchEvents();
      fetchInvitations();
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Dashboard</h1>
        <button
          className="bg-red-500 text-white p-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="mb-6">
        <Link href="/create-event">
          Create New Event
        </Link>
      </div>

      <h2 className="text-xl mt-6 mb-4">Your Events</h2>
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event.id} className="mb-2">
              <Link href={`/events/${event.id}`}>
                {event.get('name')}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You are not associated with any events.</p>
      )}

      <h2 className="text-xl mt-6 mb-4">Pending Invitations</h2>
      {invitations.length > 0 ? (
        <ul>
          {invitations.map((invitation) => (
            <li key={invitation.id} className="mb-2">
              <div>
                <p>
                  Event: {invitation.get('event').get('name')} - Role: {invitation.get('role')}
                </p>
                <button
                  className="bg-green-500 text-white p-1 rounded mr-2"
                  onClick={() => handleAcceptInvitation(invitation)}
                >
                  Accept
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no pending invitations.</p>
      )}
    </div>
  );
}
