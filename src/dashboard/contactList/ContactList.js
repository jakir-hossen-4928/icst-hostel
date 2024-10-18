import React, { useEffect, useState } from "react";
import { fetchContacts, deleteContact } from "../../backend/appwrite";
import ContactTable from "./ContactTable";
import MessageModal from "./MessageModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../shared/loading/Loading";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading

  // Fetch all contacts when component mounts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const fetchedContacts = await fetchContacts();
        setContacts(fetchedContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    loadContacts();
  }, []);

  const handleDelete = async (contactId) => {
    try {
      await deleteContact(contactId);
      setContacts(contacts.filter((contact) => contact.$id !== contactId));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleShowFullMessage = (contact) => {
    setSelectedMessage(contact);
  };

  const handleCloseModal = () => {
    setSelectedMessage(null);
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
    <div>
      <div className="overflow-x-auto m-5 border border-gray-50 my-6">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone number</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <ContactTable
                key={contact.$id}
                contact={contact}
                index={index + 1}
                onDelete={handleDelete}
                onShowFullMessage={handleShowFullMessage}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Conditionally render the MessageModal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage.message}
          fullName={selectedMessage.fullName}
          onClose={handleCloseModal}
        />
      )}

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default ContactList;
