// pages/events/[eventId]/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Parse from '../../../lib/parse';

export default function EventPage() {
  const router = useRouter();
  const { eventId } = router.query;

  useEffect(() => {
    if (eventId) {
      redirectToRoleDashboard();
    }
  }, [eventId]);

  const redirectToRoleDashboard = async () => {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Fetch the user's role for this event
    const RoleAssignment = Parse.Object.extend('RoleAssignment');
    const roleQuery = new Parse.Query(RoleAssignment);
    const eventPointer = {
      __type: 'Pointer',
      className: 'Event',
      objectId: eventId,
    };
    roleQuery.equalTo('user', currentUser);
    roleQuery.equalTo('event', eventPointer);

    try {
      const assignment = await roleQuery.first();
      if (assignment) {
        const role = assignment.get('role');
        router.push(`/events/${eventId}/${role.toLowerCase()}`);
      } else {
        alert('You do not have access to this event.');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching role assignment:', error);
    }
  };

  return <p>Redirecting...</p>;
}
