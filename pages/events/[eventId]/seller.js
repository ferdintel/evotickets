// pages/events/[eventId]/seller.js
import { useEffect, useState } from 'react';
import Parse from '../../../lib/parse';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { UserCircleIcon, UserIcon, ArrowRightStartOnRectangleIcon, ChevronDownIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function SellerDashboard() {
  const [event, setEvent] = useState(null);
  const [ticketStats, setTicketStats] = useState([]);
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '' });
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
        fetchTicketData();
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

  const fetchTicketData = async () => {
    const Ticket = Parse.Object.extend('Ticket');
    const ticketQuery = new Parse.Query(Ticket);
    const eventPointer = {
      __type: 'Pointer',
      className: 'Event',
      objectId: eventId,
    };
    const currentUser = Parse.User.current();
    ticketQuery.equalTo('event', eventPointer);
    ticketQuery.equalTo('assignedTo', {
      __type: 'Pointer',
      className: '_User',
      objectId: currentUser.id,
    });
  
    try {
      const tickets = await ticketQuery.find();
      const stats = {};
      const assignedTicketsData = [];
  
      tickets.forEach((ticket) => {
        const ticketClass = ticket.get('class') || 'Uncategorized';
        const currency = ticket.get('currency') || 'USD';
        const price = ticket.get('price') || 0;
  
        assignedTicketsData.push({
          ticketClass,
          status: ticket.get('status'),
          code: ticket.get('code'), 
        });
  
        if (!stats[ticketClass]) {
          stats[ticketClass] = {
            total: 0,
            sold: 0,
            unsold: 0,
            revenue: 0,
            currency: currency,
          };
        }
  
        stats[ticketClass].total += 1;
        if (ticket.get('status') === 'Used' || ticket.get('status') === 'Active') {
          stats[ticketClass].sold += 1;
          stats[ticketClass].revenue += price;
        }
      });
  
      for (let key in stats) {
        stats[key].unsold = stats[key].total - stats[key].sold;
      }
  
      setTicketStats(Object.entries(stats));
      setAssignedTickets(assignedTicketsData);
    } catch (error) {
      console.error('Error fetching ticket data:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    await Parse.User.logOut();
    router.push('/login');
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'CDF':
        return 'FC';
      default:
        return '';
    }
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
            <h1 className="text-2xl">{event.get('name')}</h1>
          </div>

          {/* Ticket Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
            {/* Total Tickets */}
            <div className="bg-white shadow-lg rounded-lg p-6 transition-shadow">
              <p className="text-md font-bold mb-4">Nombre de billets</p>
              {ticketStats.length > 0 ? (
                <>
                  {ticketStats.map(([ticketClass, stats]) => (
                    <div key={`${ticketClass}-total`} className="mb-2">
                      <p className="text-sm">{ticketClass}: {stats.total}</p>
                    </div>
                  ))}
                  <hr className="my-2" />
                  <p className="text-lg font-semibold">{ticketStats.reduce((sum, [, stats]) => sum + stats.total, 0)}</p>
                </>
              ) : (
                <p>No ticket data available.</p>
              )}
            </div>

            {/* Sold Tickets */}
            <div className="bg-white shadow-lg rounded-lg p-6 transition-shadow">
              <p className="text-md font-bold mb-4">Billets vendus</p>
              {ticketStats.length > 0 ? (
                <>
                  {ticketStats.map(([ticketClass, stats]) => (
                    <div key={`${ticketClass}-sold`} className="mb-2">
                      <p className="text-sm">{ticketClass}: {stats.sold}</p>
                    </div>
                  ))}
                  <hr className="my-2" />
                  <p className="text-lg font-semibold">{ticketStats.reduce((sum, [, stats]) => sum + stats.sold, 0)}</p>
                </>
              ) : (
                <p>No ticket data available.</p>
              )}
            </div>

            {/* Unsold Tickets */}
            <div className="bg-white shadow-lg rounded-lg p-6 transition-shadow">
              <p className="text-md font-bold mb-4">Billets non-vendus</p>
              {ticketStats.length > 0 ? (
                <>
                  {ticketStats.map(([ticketClass, stats]) => (
                    <div key={`${ticketClass}-unsold`} className="mb-2">
                      <p className="text-sm">{ticketClass}: {stats.unsold}</p>
                    </div>
                  ))}
                  <hr className="my-2" />
                  <p className="text-lg font-semibold">{ticketStats.reduce((sum, [, stats]) => sum + stats.unsold, 0)}</p>
                </>
              ) : (
                <p>No ticket data available.</p>
              )}
            </div>

            {/* Revenue */}
            <div className="bg-white shadow-lg rounded-lg p-6 transition-shadow">
              <p className="text-md font-bold mb-4">Revenus</p>
              {ticketStats.length > 0 ? (
                <>
                  {ticketStats.map(([ticketClass, stats]) => (
                    <div key={`${ticketClass}-revenue`} className="mb-2">
                      <p className="text-sm">
                        {ticketClass}: {getCurrencySymbol(stats.currency)}{stats.revenue.toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <hr className="my-2" />
                  <p className="text-lg font-semibold">
                    {getCurrencySymbol(ticketStats[0][1].currency)}
                    {ticketStats.reduce((sum, [, stats]) => sum + stats.revenue, 0).toFixed(2)}
                  </p>
                </>
              ) : (
                <p>No ticket data available.</p>
              )}
            </div>
          </div>

       
          <div className="p-6 bg-white rounded-lg shadow-lg mt-6">
            <h2 className="text-xl mb-4">Mes billets</h2>
            {assignedTickets.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Code</th>
                    <th className="py-2 px-4 border-b text-left">Catégorie</th>
                    <th className="py-2 px-4 border-b text-left">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedTickets.map((ticket, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{ticket.code}</td>
                      <td className="py-2 px-4 border-b">{ticket.ticketClass}</td>
                      <td className="py-2 px-4 border-b">{ticket.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No assigned tickets available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
