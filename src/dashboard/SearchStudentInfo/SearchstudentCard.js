import React from "react";

const SearchstudentCard = ({ card }) => {
  const {
    name,         // Student's name
    email,        // Student's email
    studentId,    // Student's ID
    photo,        // URL to student's photo
    room,         // Student's room number
    institute,    // Institute name
    semester,     // Semester number
    number        // Student's contact number
  } = card;

  return (
    <div className="card bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg mx-auto max-w-xs sm:max-w-md md:max-w-sm lg:max-w-xs h-auto rounded-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <figure className="px-6 pt-6 h-56 flex items-center justify-center bg-white rounded-t-xl">
        <img
          src={photo}
          alt={name}
          className="rounded-lg w-full h-full object-contain transition-opacity duration-300 hover:opacity-90"
        />
      </figure>
      <div className="card-body text-center p-6 bg-white rounded-b-xl flex flex-col items-center justify-center">
        <h2 className="card-title text-center text-2xl font-semibold text-gray-900 mb-4">
          {name}
        </h2>

        <div className="flex flex-col items-center text-gray-700">
          <p className="mb-1">
            <span className="font-medium">Student ID: </span>
            {studentId}
          </p>
          <p className="mb-1">
            <span className="font-medium">Email: </span>
            {email}
          </p>
          <p className="mb-1">
            <span className="font-medium">Phone Number: </span>
            {number}
          </p>
          <p className="mb-1">
            <span className="font-medium">Room Number: </span>
            {room}
          </p>
          <p className="mb-1">
            <span className="font-medium">Institute: </span>
            {institute}
          </p>
          <p className="mb-1">
            <span className="font-medium">Semester: </span>
            {semester}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchstudentCard;
