import React, { useState, useEffect } from 'react';
import { fetchRooms } from '../../backend/appwrite';
import useTitle from '../../shared/useTitle/useTitle';

const RoomsMap = () => {
  useTitle('Rooms-Map')
  const [roomsData, setRoomsData] = useState({ floors: [] }); // Initial state with floors as an empty array
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch rooms data from Appwrite on component mount
  useEffect(() => {
    const getRooms = async () => {
      try {
        const rooms = await fetchRooms(); // Fetch room data from Appwrite
        console.log("Fetched Rooms Data:", rooms); // Log fetched data

        // Transform the flat array into a nested structure
        const transformedData = rooms.reduce((acc, room) => {
          const floorNumber = room.floor_number; // Get floor number
          const existingFloor = acc.find(floor => floor.floorNumber === floorNumber); // Check if floor already exists

          const availableSeats = room.total_seats - room.student_in_room.length; // Calculate available seats

          if (existingFloor) {
            // If it exists, push the new room into that floor's rooms array
            existingFloor.rooms.push({
              number: room.room_number,
              totalSeats: room.total_seats,
              availableSeats: availableSeats,
              students: room.student_in_room, // Store all students as an array
            });
          } else {
            // If it does not exist, create a new floor entry
            acc.push({
              floorNumber: floorNumber,
              type: 'Student Rooms', // Assuming a static type for now
              rooms: [{
                number: room.room_number,
                totalSeats: room.total_seats,
                availableSeats: availableSeats,
                students: room.student_in_room, // Store all students as an array
              }],
            });
          }
          return acc; // Return the accumulator for the next iteration
        }, []);

        console.log("Transformed Data:", transformedData); // Log transformed data
        setRoomsData({ floors: transformedData }); // Store transformed data in state
      } catch (error) {
        console.error("Failed to fetch rooms data:", error);
      } finally {
        setLoading(false); // Ensure loading is stopped in both success and error cases
      }
    };

    getRooms();
  }, []);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-white"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-white"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-5xl font-bold text-center mb-8 text-indigo-700">Room Allocations</h1>

      <div className="grid grid-cols-1 gap-8">
        {/* Render floors and rooms */}
        {roomsData.floors.map((floor) => (
          <div key={floor.floorNumber} className="border border-indigo-300 p-5 rounded-lg shadow-lg hover:bg-indigo-50 transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-indigo-600">Floor {floor.floorNumber} - {floor.type}</h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {/* Render each room */}
              {floor.rooms.map((room) => (
                <label
                  key={room.number}
                  htmlFor={`room-modal-${room.number}`}
                  className={`p-3 text-center rounded-lg cursor-pointer transition-transform duration-300 transform hover:scale-105 ${room.students.length > 0 ? "bg-green-200 hover:bg-green-300" : "bg-gray-200 hover:bg-gray-300"}`}
                  onClick={() => handleRoomClick(room)}
                >
                  <span className="font-medium text-lg">Room {room.number}</span>
                  <br />
                  <span className="text-sm text-gray-600">Seats: {room.totalSeats}</span>
                  <br />
                  <span className="text-sm text-gray-600">Available: {room.availableSeats}</span>
                  {/* Hidden checkbox for modal */}
                  <input type="checkbox" id={`room-modal-${room.number}`} className="modal-toggle" />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for displaying selected room details */}
      {selectedRoom && (
        <div className="modal modal-open">
          <div className="modal-box relative p-6 bg-white rounded-lg shadow-lg">
            <button
              onClick={() => setSelectedRoom(null)}
              className="btn btn-sm btn-circle absolute right-2 top-2 hover:bg-red-500"
            >
              ✕
            </button>
            <h3 className="font-bold text-2xl text-indigo-700 mb-4">Room Details</h3>
            <p className="text-lg"><strong>Room Number:</strong> {selectedRoom.number}</p>
            <p className="text-lg"><strong>Total Seats:</strong> {selectedRoom.totalSeats}</p>
            <p className="text-lg"><strong>Available Seats:</strong> {selectedRoom.availableSeats}</p>
            <p className="text-lg"><strong>Students:</strong></p>
            <ul className="list-disc list-inside">
              {selectedRoom.students.length > 0 ? (
                selectedRoom.students.map((student, index) => (
                  <li key={index}>{student}</li>
                ))
              ) : (
                <li>No Students Allocated</li>
              )}
            </ul>
          </div>
          {/* Close modal when clicking outside */}
          <label className="modal-backdrop" onClick={() => setSelectedRoom(null)}></label>
        </div>
      )}
    </div>
  );
};

export default RoomsMap;
