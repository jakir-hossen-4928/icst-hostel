import React from "react";

const Herrobanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-gray-900">
      <div className="carousel w-full">
        {/* Slide 1 */}
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="https://i.ibb.co/MMyqKqT/icst.jpg"
            className="w-full h-[200px] md:h-[300px] lg:h-[400px] object-cover" // Responsive height adjustments
            alt="Slide 1"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>

        {/* Slide 2 */}
        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="https://i.ibb.co/pjDTb7K/icst-class.jpg"
            className="w-full h-[200px] md:h-[300px] lg:h-[400px] object-cover" // Responsive height adjustments
            alt="Slide 2"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide3" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>

        {/* Add more slides if needed */}
      </div>
    </div>
  );
};

export default Herrobanner;