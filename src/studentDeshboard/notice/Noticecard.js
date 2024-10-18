import React from "react";

const Noticecard = ({ notice }) => {
  const { date, notice_title, image } = notice;

  return (
    <div className="max-w-sm mx-auto group hover:no-underline focus:no-underline bg-gray-50 shadow-2xl shadow-sky-400">
      {image && (
        <img
          role="presentation"
          className="object-cover w-full rounded h-44 bg-gray-500"
          src={image}
          alt={notice_title}
        />
      )}

      <div className="p-6 space-y-2">
        <h3 className="text-2xl font-semibold">{notice_title}</h3>
        <span className="text-xs text-gray-600">{new Date(date).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default Noticecard;