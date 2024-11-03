// components/QRCodeScanner.js
import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';

export default function QRCodeScanner({ onScan }) {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    let animationFrameId;
    let videoStream;

    const startVideo = async () => {
      try {
        videoStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        videoRef.current.srcObject = videoStream;
        videoRef.current.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
        await videoRef.current.play();
        tick();
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    const tick = () => {
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvasElement = document.createElement('canvas');
        const canvas = canvasElement.getContext('2d');
        canvasElement.width = videoRef.current.videoWidth;
        canvasElement.height = videoRef.current.videoHeight;
        canvas.drawImage(
          videoRef.current,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        const imageData = canvas.getImageData(
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setScanning(false);
          videoStream.getTracks().forEach((track) => track.stop());
          onScan(code.data);
        } else {
          animationFrameId = requestAnimationFrame(tick);
        }
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    if (scanning) {
      startVideo();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [scanning, onScan]);

  return (
    <div className="w-full h-full">
      {scanning && (
        <video
          ref={videoRef}
          style={{ width: '100%', height: 'auto' }}
          muted
        />
      )}
    </div>
  );
}
