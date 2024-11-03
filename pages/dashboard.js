import { useEffect, useState } from 'react';
import Parse from '../lib/parse';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { UserCircleIcon, UserIcon, ArrowRightStartOnRectangleIcon, ChevronDownIcon, PlusIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '' });
  const router = useRouter();

  useEffect(() => {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      router.push('/login');
    } else {
      const firstName = currentUser.get('firstName');
      const lastName = currentUser.get('lastName');
      setUserDetails({ firstName, lastName });
      
      fetchEvents();
      fetchInvitations();
    }
  }, []);

  const fetchEvents = async () => {
    const currentUser = Parse.User.current();
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
    invitationQuery.include(['event', 'sender']); 

    try {
      const invitations = await invitationQuery.find();
      

      for (let invitation of invitations) {
        const sender = invitation.get('sender');
        if (sender) {
          await sender.fetch(); 
        }
      }

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
      const RoleAssignment = Parse.Object.extend('RoleAssignment');
      const roleAssignment = new RoleAssignment();
      roleAssignment.set('event', invitation.get('event'));
      roleAssignment.set('user', Parse.User.current());
      roleAssignment.set('role', invitation.get('role'));
      await roleAssignment.save();

      invitation.set('status', 'Accepted');
      await invitation.save();

      fetchEvents();
      fetchInvitations();
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleDeclineInvitation = async (invitation) => {
    try {
      invitation.set('status', 'Declined');
      await invitation.save();
      fetchInvitations();
    } catch (error) {
      console.error('Error declining invitation:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="">
      <div className="flex p-6 bg-[#20073b] justify-between items-center mb-6">
        <Image
          src="/logo-evotickets.png"
          width={200}
          height={200}
          alt="Logo"
        />

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-white font-semibold"
          >
            <p>{userDetails.firstName} {userDetails.lastName}</p>
            <UserCircleIcon className="size-8" />
            <ChevronDownIcon className="size-4" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
              <Link className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100" href="/profile">
                Mon profile
                <UserIcon className="size-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                <p>Se déconnecter</p>
                <ArrowRightStartOnRectangleIcon className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="mb-6 w-60">
          <Link className="w-full flex items-center justify-center space-x-2 bg-[#fe0980] font-semibold text-white p-4 rounded-xl" href="/create-event">
            <p>Créer un évènement</p>
            <PlusIcon className="size-6" />
          </Link>
        </div>

        <h2 className="text-xl mt-6 mb-4">Mes Evènements</h2>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventImage = event.get('image') ? event.get('image').url() : '/placeholder.png'; 
              return (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="flex bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow">
                    
                    <div className="w-1/3">
                      <Image
                        src={eventImage}
                        alt={`Image for ${event.get('name')}`}
                        width={200}
                        height={200}
                        className="object-cover rounded-lg"
                      />
                    </div>

                    
                    <div className="w-2/3 pl-4">
                      <h3 className="text-xl font-semibold mb-2">{event.get('name')}</h3>
                      <div className="flex space-x-1 items-center text-gray-600">
                        <CalendarIcon className="size-4" /> 
                        <p>{new Date(event.get('date')).toLocaleDateString()}</p>
                      </div>
                      <div className="flex space-x-1 items-center text-gray-600">
                        <MapPinIcon className="size-4" /> 
                        <p>{event.get('location')}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p>Vous n'êtes associé à aucun événement.</p>
        )}

        <h2 className="text-xl mt-6 mb-4">Invitations en Attente</h2>
        {invitations.length > 0 ? (
          <ul>
            {invitations.map((invitation) => (
              <li key={invitation.id} className="mb-2">
                <div className="bg-white p-6 rounded-md shadow-lg" >
                  <p className="font-bold text-lg" >
                    {invitation.get('event').get('name')} <br/>
                  </p>
                  <p className="mb-4" > par {invitation.get('sender').get('firstName')} {invitation.get('sender').get('lastName')} </p>
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-500 flex-1 text-white p-1 rounded"
                      onClick={() => handleAcceptInvitation(invitation)}
                    >
                      Accepter
                    </button>
                    <button
                      className="bg-red-500 flex-1 text-white p-1 rounded"
                      onClick={() => handleDeclineInvitation(invitation)}
                    >
                      Refuser
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Vous n'avez aucune invitation en attente.</p>
        )}
      </div>
    </div>
  );
}
