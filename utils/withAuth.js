// utils/withAuth.js
import { useEffect, useState } from 'react';
import Parse from './parseConfig';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const [authorized, setAuthorized] = useState(false);
    const [userEvents, setUserEvents] = useState([]);
    const router = useRouter();

    useEffect(() => {
      const checkUser = async () => {
        const currentUser = Parse.User.current();
        if (currentUser) {
          // Check user roles
          const roleQuery = new Parse.Query(Parse.Role);
          roleQuery.equalTo('users', currentUser);
          const roles = await roleQuery.find();
          const userRoles = roles.map((role) => role.get('name'));
          const hasRole = userRoles.some((role) =>
            allowedRoles.includes(role)
          );

          if (hasRole) {
            // Fetch user associated events
            const eventsRelation = currentUser.relation('events');
            const eventsQuery = eventsRelation.query();
            const events = await eventsQuery.find();
            setUserEvents(events);
            setAuthorized(true);
          } else {
            alert('Access denied. You do not have permission to view this page.');
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      };

      checkUser();
    }, [router]);

    if (!authorized) {
      return null;
    }

    return <WrappedComponent {...props} userEvents={userEvents} />;
  };
};

export default withAuth;
