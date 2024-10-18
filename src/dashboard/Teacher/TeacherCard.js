import React from "react";

const TeacherCard = ({card}) => {
    const {img,name,subject} = card;


  return (

      <div className="flex flex-col justify-center w-full px-8 mx-6 my-12 text-center rounded-md md:w-96 lg:w-80 xl:w-64 bg-gray-400">
        <img
          alt=""
          className="self-center flex-shrink-0 w-24 h-24 -mt-12 bg-center bg-cover rounded-full dark:bg-gray-500"
          src={img}
        />
        <div className="flex-1 my-4">
          <p className="text-xl font-semibold leading-snug">{name}</p>
          <p>{subject}</p>
        </div>
      </div>

  );
};

export default TeacherCard;
