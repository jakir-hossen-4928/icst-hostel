import React from 'react';

const MessageModal = ({ message, fullName, onClose }) => {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-5"
            onClick={onClose} // Close modal on overlay click
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            >
                <h3 className="text-xl font-bold mb-4">Message from {fullName}</h3>

                {/* Fixed height with scrolling for long messages */}
                <div className="mt-4 max-h-60 overflow-y-auto">
                    <p>{message}</p>
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default MessageModal;
