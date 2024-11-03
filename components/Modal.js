// components/Modal.js
import React from 'react';

const Modal = ({ ticketDetails, actions, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>
        <p><strong>Code:</strong> {ticketDetails.code}</p>
        <p><strong>Status:</strong> {ticketDetails.status}</p>
        <p><strong>Class:</strong> {ticketDetails.class}</p>

        <div className="mt-4">
          {actions.map((action) => (
            <button
              key={action.status}
              onClick={() => action.onClick()}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 mb-2"
            >
              {action.label}
            </button>
          ))}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
