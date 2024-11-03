import { useEffect, useState } from 'react';
import Parse from '../../../lib/parse';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import Link from 'next/link';
import { UserCircleIcon, UserIcon, ArrowRightStartOnRectangleIcon, ChevronDownIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ManageTickets() {
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketCount, setTicketCount] = useState(1); 
  const [ticketType, setTicketType] = useState('Electronic'); 
  const [ticketClass, setTicketClass] = useState('Normal'); 
  const [ticketPrice, setTicketPrice] = useState(''); 
  const [currency, setCurrency] = useState('USD'); 
  const [loading, setLoading] = useState(false); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '' });
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
        fetchTickets();
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

  const fetchTickets = async () => {
    const Ticket = Parse.Object.extend('Ticket');
    const ticketQuery = new Parse.Query(Ticket);
    const eventPointer = {
      __type: 'Pointer',
      className: 'Event',
      objectId: eventId,
    };
    ticketQuery.equalTo('event', eventPointer);
    try {
      const tickets = await ticketQuery.find();
      setTickets(tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const generateTickets = async () => {
    if (!ticketPrice) {
      alert("Please specify the ticket price.");
      return;
    }

    setLoading(true); 
    const Ticket = Parse.Object.extend('Ticket');
    for (let i = 0; i < ticketCount; i++) {
      const ticket = new Ticket();
      ticket.set('code', uuidv4());
      ticket.set('status', 'Valid');
      ticket.set('event', event);
      ticket.set('type', ticketType); 
      ticket.set('class', ticketClass); 
      ticket.set('price', parseFloat(ticketPrice)); 
      ticket.set('currency', currency); 

      try {
        await ticket.save();
      } catch (error) {
        console.error('Error generating ticket:', error);
      }
    }
    setLoading(false); 
    fetchTickets();
  };

  const changeTicketStatus = async (ticket, status) => {
    ticket.set('status', status);
    ticket.set('lastModifiedBy', Parse.User.current()); 
    ticket.set('lastModifiedDate', new Date()); 
    try {
      await ticket.save();
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
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
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
              <Link className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-gray-100" href="/profile">
                Mon profile
                <UserIcon className="w-4 h-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                <p>Se déconnecter</p>
                <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      {event && (
        <>
          <div className="flex justify-start items-center p-6">
            <Link className="flex justify-center items-center space-x-2 mr-6" href="/dashboard">
              <ArrowLeftIcon className="size-6 text-[#fe0980]" />
              <p>Retour</p>
            </Link>
            <h1 className="text-2xl">Gestion de billets pour {event.get('name')}</h1>
          </div>

 
          <div className="flex p-6 flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
            <div className="flex-1">
              <label className="block mb-2">Nombre de Billets</label>
              <input
                type="number"
                min="1"
                value={ticketCount}
                onChange={(e) => setTicketCount(parseInt(e.target.value))}
                className="border p-2 rounded w-full"
              />
            </div>
            
            <div className="flex-1">
              <label className="block mb-2">Type de billets</label>
              <select
                value={ticketType}
                onChange={(e) => setTicketType(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="Electronic">Electronic</option>
                <option value="Printed">Printed</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-2">Catégorie</label>
              <input
                type="text"
                value={ticketClass}
                onChange={(e) => setTicketClass(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Normal, VIP, Premium, etc."
              />
            </div>

            <div className="flex-1">
              <label className="block mb-2">Prix</label>
              <input
                type="number"
                min="0"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Enter ticket price"
              />
            </div>

            <div className="flex-1">
              <label className="block mb-2">Devise</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="USD">USD</option>
                <option value="CDF">CDF</option>
              </select>
            </div>
          </div>
          
          <button
            className={`bg-blue-500 text-white p-2 rounded m-6 mt-0 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={generateTickets}
            disabled={loading}
          >
            {loading ? 'Génération...' : 'Générer des billets'}
          </button>
          

          {tickets.length > 0 ? (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Code</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Type</th>
                  <th className="py-2 px-4 border-b">Catégorie</th>
                  <th className="py-2 px-4 border-b">Prix</th>
                  <th className="py-2 px-4 border-b">Devise</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="py-2 px-4 border-b">{ticket.get('code')}</td>
                    <td className="py-2 px-4 border-b">{ticket.get('status')}</td>
                    <td className="py-2 px-4 border-b">{ticket.get('type')}</td>
                    <td className="py-2 px-4 border-b">{ticket.get('class')}</td>
                    <td className="py-2 px-4 border-b">{ticket.get('price').toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{ticket.get('currency')}</td>
                    <td className="py-2 px-4 border-b">
                      <select
                        className="border p-1 rounded"
                        value={ticket.get('status')}
                        onChange={(e) => changeTicketStatus(ticket, e.target.value)}
                      >
                        <option value="Valid">Valid</option>
                        <option value="Active">Active</option>
                        <option value="Used">Used</option>
                        <option value="Invalid">Invalid</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No tickets available.</p>
          )}
        </>
      )}
    </div>
  );
}
