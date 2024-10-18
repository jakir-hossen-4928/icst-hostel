import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ContactTable = ({ contact, index, onDelete, onShowFullMessage }) => {
    const { $id, ful_name, email, phoneNumber, message } = contact;
    const [isDeleting, setIsDeleting] = useState(false); // State to track delete operation

    // Get a preview of the message (limit to 20 characters)
    const getMessagePreview = () => {
        return message.length > 20 ? `${message.slice(0, 20)}...` : message;
    };

    // Handle clicking the contact button (opens email client)
    const handleContactClick = () => {
        window.open(`mailto:${email}`, '_self');
    };

    // Handle the delete button
    const handleDeleteClick = async () => {
        setIsDeleting(true); // Set deleting state to true
        try {
            await onDelete($id);
            toast.success(`Contact "${ful_name}" deleted successfully!`);
        } catch (error) {
            toast.error(`Failed to delete contact "${ful_name}".`);
        } finally {
            setIsDeleting(false); // Reset deleting state after operation
        }
    };

    return (
        <tr>
            <th>{index}</th>
            <td>{ful_name}</td>
            <td>{email}</td>
            <td>{phoneNumber}</td>
            <td>
                {getMessagePreview()}{" "}
                <button
                    className="text-primary underline"
                    onClick={() => onShowFullMessage(contact)}
                >
                    Show more...
                </button>
            </td>
            <td className="space-x-4">
                <button className="btn btn-primary" onClick={handleContactClick}>
                    Contact
                </button>
                <button
                    className={`btn btn-danger ${isDeleting ? 'disabled' : ''}`}
                    onClick={handleDeleteClick}
                    disabled={isDeleting} // Disable button while deleting
                >
                    {isDeleting ? (
                        <>
                            <span className="loading loading-spinner"></span>
                            Deleting...
                        </>
                    ) : (
                        'Delete'
                    )}
                </button>
            </td>
        </tr>
    );
};

export default ContactTable;