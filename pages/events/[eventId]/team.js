import { useEffect, useState } from 'react';
import Parse from '../../../lib/parse';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { UserCircleIcon, ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ManageTeam() {
  const [event, setEvent] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [ticketClass, setTicketClass] = useState('');
  const [ticketCount, setTicketCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '' });
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [modal, setModal] = useState({ isOpen: false, message: '' });
  const router = useRouter();
  const { eventId } = router.query;

  useEffect(() => {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      router.push('/login');
    } else {
      const firstName = currentUser.get('firstName');
      const lastName = currentUser.get('lastName');
      setUserDetails({ firstName, lastName });

      if (eventId) {
        fetchEvent();
        fetchTeamMembers();
        fetchCategories();
      }
    }
  }, [eventId]);

  const fetchEvent = async () => {
    const Event = Parse.Object.extend('Event');
    const query = new Parse.Query(Event);
    try {
      const event = await query.get(eventId);
      setEvent(event);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const fetchTeamMembers = async () => {
    const Invitation = Parse.Object.extend('Invitation');
    const query = new Parse.Query(Invitation);
    const eventPointer = {
      __type: 'Pointer',
      className: 'Event',
      objectId: eventId,
    };
    query.equalTo('event', eventPointer);
    query.equalTo('status', 'Accepted');
    query.include('user');

    try {
      const invitations = await query.find();
      setTeamMembers(invitations);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchCategories = async () => {
    const Ticket = Parse.Object.extend('Ticket');
    const query = new Parse.Query(Ticket);
    const eventPointer = {
      __type: 'Pointer',
      className: 'Event',
      objectId: eventId,
    };
    query.equalTo('event', eventPointer);
    try {
      const tickets = await query.find();
      const categories = [...new Set(tickets.map((ticket) => ticket.get('class')).filter(Boolean))];
      setAvailableCategories(categories);
    } catch (error) {
      console.error('Error fetching ticket categories:', error);
    }
  };

  const removeTeamMember = async (member) => {
    try {
      await member.destroy();
      fetchTeamMembers();
      alert('Member removed successfully.');
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member.');
    }
  };

  const assignTickets = async () => {
    if (!ticketClass || ticketCount <= 0 || !selectedMember) {
      setModal({ isOpen: true, message: 'Please specify a valid ticket category, count, and team member.' });
      return;
    }
  
    const Ticket = Parse.Object.extend('Ticket');
    const query = new Parse.Query(Ticket);
    const eventPointer = {
      __type: 'Pointer',
      className: 'Event',
      objectId: eventId,
    };
    query.equalTo('event', eventPointer);
    query.equalTo('class', ticketClass);
    query.equalTo('status', 'Valid');
  
    try {
      const availableTickets = await query.find();
      const ticketsToAssign = availableTickets.slice(0, ticketCount);
  
      for (let ticket of ticketsToAssign) {
        ticket.set('assignedTo', {
          __type: 'Pointer',
          className: '_User',
          objectId: selectedMember,
        });
        await ticket.save();
      }
  
      setModal({ isOpen: true, message: 'Tickets assigned successfully.' });
      fetchTeamMembers();
    } catch (error) {
      console.error('Error assigning tickets:', error);
      setModal({ isOpen: true, message: 'Failed to assign tickets.' });
    }
  };
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    await Parse.User.logOut();
    router.push('/login');
  };

  return (
    <div className="">


{modal.isOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <p>{modal.message}</p>
      <button
        onClick={() => setModal({ isOpen: false, message: '' })}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Close
      </button>
    </div>
  </div>
)}
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
            <UserCircleIcon className="w-8 h-8" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
              <Link className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100" href="/profile">
                Mon profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>

      {event && (
        <>
          <div className="flex justify-start items-center p-6">
            <Link className="flex justify-center items-center space-x-2 mr-6" href={`/events/${eventId}/manage`}>
              <ArrowLeftIcon className="size-6 text-[#fe0980]" />
              Retour
            </Link>
            <h1 className="text-2xl">Gérer l'équipe pour {event.get('name')}</h1>
          </div>

          {/* Team Members Section */}
          <div className="p-6">
            {teamMembers.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Nom</th>
                    <th className="py-2 px-4 border-b text-left">Rôle</th>
                    <th className="py-2 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="py-2 px-4 border-b">{member.get('user').get('firstName')} {member.get('user').get('lastName')}</td>
                      <td className="py-2 px-4 border-b">{member.get('role')}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => removeTeamMember(member)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-5 h-5 inline" /> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucun membre d'équipe disponible.</p>
            )}
          </div>

          {/* Assign Tickets Section */}
          <div className="p-6 bg-white rounded-lg shadow-lg mt-6">
            <h2 className="text-xl mb-4">Attribuer des billets</h2>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
              <div className="flex-1">
                <label className="block mb-2">Catégorie de billet</label>
                <select
                  value={ticketClass}
                  onChange={(e) => setTicketClass(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-2">Nombre de billets</label>
                <input
                  type="number"
                  min="1"
                  value={ticketCount}
                  onChange={(e) => setTicketCount(parseInt(e.target.value))}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2">Membre de l'équipe</label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Sélectionner un membre</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.get('user').id}>
                      {member.get('user').get('firstName')} {member.get('user').get('lastName')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={assignTickets}
            >
              Assigner des billets
            </button>
          </div>
        </>
      )}
    </div>
  );
}
