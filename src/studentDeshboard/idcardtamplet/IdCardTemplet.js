import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useSwipeable } from 'react-swipeable';
import { getUserData } from '../../backend/appwrite';
import Loading from '../../shared/loading/Loading';


const IdCardTemplate = () => {

  const [viewQRCode, setViewQRCode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // New state for QR code URL
  const canvasRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewQRCode = async () => {
    if (!qrCodeUrl) {
      // Generate QR code only if it's not already generated
      const qrCodeData = JSON.stringify({
        name: userData?.name,
        email: userData?.email,
        studentId: userData?.studentId,
        room: userData?.room,
        semester: userData?.semester,
        number: userData?.number,
      });
      const url = await generateQRCode(qrCodeData);
      setQrCodeUrl(url); // Set generated QR code URL to state
    }
    setViewQRCode(true);
  };

  const handleBackToIdCard = () => {
    setViewQRCode(false);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleViewQRCode,
    onSwipedRight: handleBackToIdCard,
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 50,
  });

  const downloadIdCard = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = 1000;
    canvas.height = 500;

    // Background
    context.fillStyle = '#E6ECF0'; // Soft and light background for professionalism
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Card Border
    context.strokeStyle = '#8D99AE'; // Light border color for a refined look
    context.lineWidth = 5;
    context.strokeRect(5, 5, canvas.width - 10, canvas.height - 10); // Border with padding

    // Card Shadow (for a subtle 3D effect)
    context.shadowColor = '#A0AEC0';
    context.shadowBlur = 10;
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;

    // Hostel name (title)
    context.fillStyle = '#2B2D42'; // Dark text for strong contrast
    context.font = 'bold 28px Arial';
    context.textAlign = 'center';
    context.fillText("ইনস্টিটিউট অব কম্পিউটার সায়েন্স এন্ড টেকনোলজি, ছাত্রাবাস", canvas.width / 2, 50);

    // Reset shadow after drawing text
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    // User photo - larger size and placed on the left
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = userData?.photo || "https://ibb.co.com/4K70hJS";

    img.onload = async () => {
        // Draw user photo - larger size and aligned on the left
        context.drawImage(img, 20, 70, 350, 400); // Adjusted size and positioning

        // User details section styling
        context.fillStyle = '#2F3640'; // Dark gray for text readability
        context.textAlign = 'left';

        // Name styling
        context.font = 'bold 32px Arial';
        context.fillText(userData?.name || 'Name', 400, 100);

        // General details styling
        context.font = '20px Arial';
        context.fillText(`Email: ${userData?.email || 'email@example.com'}`, 400, 150);
        context.fillText(`Institute: ${userData?.institute || 'Institute Name'}`, 400, 190);
        context.fillText(`ID Number: ${userData?.studentId || 'ID12345'}`, 400, 230);
        context.fillText(`Room No: ${userData?.room || 'Room No'}`, 400, 270);
        context.fillText(`Semester: ${userData?.semester || 'Semester'}`, 400, 310);
        context.fillText(`Number: ${userData?.number || 'Number'}`, 400, 350);

        // Generate QR Code for additional information
        const qrCodeData = JSON.stringify({
            name: userData?.name,
            email: userData?.email,
            studentId: userData?.studentId,
            room: userData?.room,
            semester: userData?.semester,
            number: userData?.number,
        });

        const qrCodeUrl = await generateQRCode(qrCodeData);
        const qrCodeImage = new Image();
        qrCodeImage.crossOrigin = "anonymous";
        qrCodeImage.src = qrCodeUrl;

        qrCodeImage.onload = () => {
            // Draw QR code on the right side below the text
            context.drawImage(qrCodeImage, canvas.width - 140, 340, 120, 120);

            // Download functionality
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${userData?.name} hostel ID card.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    };
  };

  const generateQRCode = async (text) => {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(text, { width: 96, margin: 1 }, (err, url) => {
        if (err) reject(err);
        resolve(url);
      });
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <style>
        {`
          .perspective-1000 {
            perspective: 1000px;
          }
          .transform-style-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
          .rotate-y-0 {
            transform: rotateY(0deg);
          }
          .transition-transform {
            transition: transform 0.6s ease-in-out;
          }
        `}
      </style>

      <div className="perspective-1000 sm:m-4 m-2 w-full sm:w-[400px] md:w-[500px] h-[350px] relative" {...swipeHandlers}>
        <div className={`transform-style-3d w-full h-full absolute transition-transform ${viewQRCode ? 'rotate-y-180' : 'rotate-y-0'}`}>

          {/* Front Side (ID Card) */}
          <div className="backface-hidden w-full h-full absolute bg-white shadow-xl rounded-lg p-6">
  <div className="grid grid-cols-2 gap-4 w-full">
    {/* Profile Image */}
    <div className="flex justify-center items-center bg-gray-200 h-full w-full p-2">
  <img
    className="h-full w-full object-cover"
    src={userData?.photo || "https://dummyimage.com/600x400/ccc/000"}
    alt="Profile"
  />
</div>


    {/* Information Section */}
    <div className="flex flex-col justify-center text-left">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
        {userData?.name}
      </h1>
      <p className="text-sm sm:text-md text-gray-700 mt-1 break-words">
        Email: {userData?.email}
      </p>
      <p className="text-sm sm:text-md text-gray-700 break-words">
        Institute: {userData?.institute}
      </p>
      <p className="text-sm sm:text-md text-gray-700 break-words">
        ID Number: {userData?.studentId}
      </p>
      <p className="text-sm sm:text-md text-gray-700 break-words">
        Room No: {userData?.room}
      </p>
      <p className="text-sm sm:text-md text-gray-700 break-words">
        Semester: {userData?.semester}
      </p>
      <p className="text-sm sm:text-md text-gray-700 break-words">
        Number: {userData?.number}
      </p>
    </div>
  </div>

  {/* Centered Buttons */}
  <div className="mt-4 flex justify-center gap-2 sm:gap-4">
    <button
      onClick={handleViewQRCode}
      className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-transform duration-300 ease-in-out shadow-lg hover:scale-105"
    >
      View QR Code
    </button>

    <button
      onClick={downloadIdCard}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition-transform duration-300 ease-in-out shadow-lg hover:scale-105"
    >
      Download ID Card
    </button>
  </div>
</div>


          {/* Back Side (QR Code) */}
          <div className="backface-hidden w-full h-full absolute bg-white shadow-xl rounded-lg p-6 rotate-y-180 flex flex-col items-center justify-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4">Scan for Details</h1>
            <div className="flex justify-center mb-4">
              {/* Dynamically rendered QR code */}
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" />
              ) : (
                <p>Generating QR Code...</p>
              )}
            </div>

            <button
              onClick={handleBackToIdCard}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-transform duration-300 ease-in-out shadow-lg hover:scale-105"
            >
              Back to ID Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdCardTemplate;
