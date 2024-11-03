// components/TicketQRCode.js
import QRCode from 'qrcode.react';

export default function TicketQRCode({ code }) {
  return (
    <div className="p-4 border rounded">
      <QRCode value={code} size={256} />
      <p className="mt-2 text-center">Ticket Code: {code}</p>
    </div>
  );
}
