import { useEffect, useState } from 'react';
import Image from 'next/image';
import { UserCircleIcon, UserIcon, ArrowRightStartOnRectangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Parse from '../../../lib/parse';
import { useRouter } from 'next/router';

import { Modal } from '../../../components/Modal';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import dynamic from 'next/dynamic';


const QrReader = dynamic(() =>
  import('react-qr-reader').then((mod) => mod.QrReader),
  { ssr: false }
);

export default function ScannerPage() {
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '' });
  const [ticketDetails, setTicketDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [role, setRole] = useState('Manager');
  const [isScanning, setIsScanning] = useState(true);
  const router = useRouter();
  const { eventId } = router.query;

  useEffect(() => {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUserDetails({
        firstName: currentUser.get('firstName'),
        lastName: currentUser.get('lastName'),
      });
      fetchUserRole(currentUser);
    }
  }, [eventId]);

  

  const fetchUserRole = async (user) => {
    try {
      // Step 1: Check if the user is the creator of the event
      const Event = Parse.Object.extend('Event');
      const eventQuery = new Parse.Query(Event);
      eventQuery.equalTo('objectId', eventId);
      eventQuery.equalTo('manager', user); 
  
      const event = await eventQuery.first();
      console.log(event)
      if (event) {
        setRole('Manager');
        return;
      }
  

      const Invitation = Parse.Object.extend('Invitation');
      const invitationQuery = new Parse.Query(Invitation);
      const eventPointer = {
        __type: 'Pointer',
        className: 'Event',
        objectId: eventId,
      };
      invitationQuery.equalTo('event', eventPointer);
      invitationQuery.equalTo('user', user);
  
      const invitation = await invitationQuery.first();
      if (invitation) {
        setRole(invitation.get('role'));
      } else {
        console.warn('No invitation found for the current user and event.');
        setRole(''); 
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };
  


  const handleError = (error) => {
    console.error('QR Scan Error:', error);
  };

  const handleAction = async (newStatus) => {
    try {
      const Ticket = Parse.Object.extend('Ticket');
      const query = new Parse.Query(Ticket);
      query.equalTo('code', ticketDetails.code);
      const ticket = await query.first();

      if (ticket) {
        ticket.set('status', newStatus);
        await ticket.save();
        alert('Ticket status updated successfully');
        setModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      alert('Failed to update ticket status');
    }
  };

  const handleScan = async (data) => {  
    if (data !== undefined) {  
      try {  
        const Ticket = Parse.Object.extend('Ticket');  
        const query = new Parse.Query(Ticket);  
        query.equalTo('code', data);  
        const ticket = await query.first();  

        if (ticket) {  
          setTicketDetails({  
            code: ticket.get('code'),  
            status: ticket.get('status'),  
            class: ticket.get('class') || 'Unknown', // Valeur par défaut  
          });  
        } else {  
          alert('Ticket not found');  
          setIsScanning(true);  
        }  
      } catch (error) {  
        console.error('Error scanning ticket:', error);  
        alert('Failed to scan ticket. Please try again.');  
        setIsScanning(true);  
      }  
    } else {  
      console.log("No data scanned.");  
    }  
};

  const getAvailableActions = () => {
    if (role === 'Manager') {
      return [
        { label: 'Set to Active', status: 'Active' },
        { label: 'Set to Used', status: 'Used' },
        { label: 'Set to Invalid', status: 'Invalid' },
      ];
    } else if (role === 'Seller' && ticketDetails.status === 'Valid') {
      return [{ label: 'Set to Active', status: 'Active' }];
    } else if (role === 'Controller' && ticketDetails.status === 'Active') {
      return [{ label: 'Set to Used', status: 'Used' }];
    }
    return [];
  };

  useEffect(() => {
    if (ticketDetails) {
      setModalOpen(true)
    }
  }, [ticketDetails]);

  return (
    <div className="bg-[#180c2a] w-scree h-screen ">

        <div className="w-full flex justify-center items-center p-6" >
                      <Image
          src="/logo-evotickets.png"
          width={200}
          height={200}
          alt="Logo"
        />
        </div>
      
     

      <div className="flex w-full justify-center items-center p-6">
       
        <h1 className="text-lg text-white ">Veuillez scanner le code d'un billet</h1>
      </div>

      <div className="p-6">
      {isScanning && (
        <QrReader
          delay={300}
          constraints={{ facingMode: 'environment' }}
          onError={handleError}
          onResult={(result, error) => {
          
              handleScan(result?.text);

          }}
          style={{ width: '100%' }}
        />
      )}
        <div className="w-full flex justify-center items-center" >
          <Link  className="flex  justify-center bg-[#fe0980] text-white items-center space-x-2 p-2 mt-4 rounded-full w-1/2" href="/dashboard" >
            <ArrowLeftIcon className="size-6" />
                <p>Retour</p>
            </Link>  
        </div>


         
      </div>

     

      {modalOpen && ticketDetails && (
  <Modal
    ticketDetails={ticketDetails}
    actions={getAvailableActions().map((action) => ({
      ...action,
      onClick: () => handleAction(action.status),
    }))}
    onClose={() => setModalOpen(false)}
  />
)}
    </div>
  );
}
