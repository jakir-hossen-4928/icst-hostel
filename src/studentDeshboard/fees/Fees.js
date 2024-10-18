import React, { useState } from 'react';

const studentsData = [
  {
    student_id: '1',
    name: 'John Doe',
    roomNumber: '101',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    hostel_fee_due: 1500,
    hostel_fee_paid: 1500,
    meal_fee_due: 3000,
    meal_fee_paid: 2500,
    hostel_paid_months: ['January', 'February', 'March', 'April','April', 'May', 'June'],
    hostel_due_months: ['April', 'February', 'March', 'August', 'April','April','June'],
    meal_paid_months: ['January', 'February', 'March', 'April','April','April', 'May'],
    meal_due_months: ['March', 'February', 'March', 'May','April','April', 'April'],
    transaction_history: [
      { month: 'January', fee_type: 'Hostel', transaction_id: 'TXN123', amount: 1500, status: 'Paid' },
      { month: 'February', fee_type: 'Meal', transaction_id: 'TXN456', amount: 1500, status: 'Paid' },
      { month: 'March', fee_type: 'Meal', transaction_id: 'TXN789', amount: 1500, status: 'Paid' },
      { month: 'April', fee_type: 'Meal', transaction_id: 'TXN790', amount: 1500, status: 'Paid' },
      { month: 'April', fee_type: 'Hostel', transaction_id: 'TXN791', amount: 1500, status: 'Paid' },
    ],
  },
];

const Fees = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFeeType, setSelectedFeeType] = useState(''); // 'Hostel Fee' or 'Meal Fee'
  const [selectedMonth, setSelectedMonth] = useState(''); // The selected month for payment
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePaymentClick = (student) => {
    setSelectedStudent(student);
    setSelectedFeeType(''); // Reset fee type when opening modal
    setIsModalOpen(true);
  };

  const handleFeeTypeSelection = (feeType) => {
    setSelectedFeeType(feeType);
    setSelectedMonth(''); // Reset month selection after choosing fee type
  };

  const handleMonthSelection = (month) => {
    setSelectedMonth(month);
  };

  const processPayment = () => {
    if (selectedFeeType && selectedMonth) {
      alert(`Processing payment for ${selectedFeeType} in ${selectedMonth}`);
      setIsModalOpen(false);
      setSelectedStudent(null);
      setSelectedMonth('');
      setSelectedFeeType('');
    } else {
      alert('Please select a fee type and a month.');
    }
  };

  const downloadReceipt = (transactionId) => {
    alert(`Downloading receipt for Transaction ID: ${transactionId}`);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-5xl font-bold text-center text-indigo-700 mb-10">Your Hostel and Meal Fees</h1>

      {studentsData.map((student) => (
        <div key={student.student_id} className="bg-white shadow-md rounded-lg mb-8 p-6 transition-all duration-300 hover:shadow-lg">
          {/* Grid for student info, hostel fee, and meal fee */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Information Section */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-indigo-600">{student.name}</h2>
              <p className="text-gray-600 mt-2"><strong>Room Number:</strong> {student.roomNumber}</p>
              <p className="text-gray-600 mt-1"><strong>Email:</strong> {student.email}</p>
              <p className="text-gray-600 mt-1"><strong>Phone:</strong> {student.phone}</p>
            </div>

            {/* Hostel Fee Section */}
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-green-700">Hostel Fee</h3>
              <p className="text-gray-700 mt-2"><strong>Due:</strong> {student.hostel_fee_due} BDT</p>
              <p className="text-gray-700"><strong>Paid:</strong> {student.hostel_fee_paid} BDT</p>
              <p className="mt-2 text-sm"><strong>Paid Months:</strong> {student.hostel_paid_months.join(', ')}</p>
              <p className="text-sm"><strong>Due Months:</strong> {student.hostel_due_months.join(', ')}</p>
            </div>

            {/* Meal Fee Section */}
            <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-orange-600">Meal Fee</h3>
              <p className="text-gray-700 mt-2"><strong>Due:</strong> {student.meal_fee_due} BDT</p>
              <p className="text-gray-700"><strong>Paid:</strong> {student.meal_fee_paid} BDT</p>
              <p className="mt-2 text-sm"><strong>Paid Months:</strong> {student.meal_paid_months.join(', ')}</p>
              <p className="text-sm"><strong>Due Months:</strong> {student.meal_due_months.join(', ')}</p>
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePaymentClick(student)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Pay Fees
            </button>
          </div>

          {/* Transaction History Section */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-center text-gray-700 mb-4">Transaction History</h4>
            <div className="transaction-history bg-gray-100 p-4 rounded-lg max-h-80 overflow-y-auto shadow-sm">
              {student.transaction_history.map((transaction, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg mb-4 shadow flex flex-col md:flex-row justify-between items-center transition-all duration-300 hover:shadow-md"
                >
                  <div className="mb-2 md:mb-0">
                    <p><strong>Month:</strong> {transaction.month}</p>
                    <p><strong>Fee Type:</strong> {transaction.fee_type}</p>
                    <p><strong>Transaction ID:</strong> {transaction.transaction_id}</p>
                    <p><strong>Amount:</strong> {transaction.amount} BDT</p>
                    <span
                      className={`text-white py-1 px-3 rounded-full ${transaction.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                  <button
                    onClick={() => downloadReceipt(transaction.transaction_id)}
                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded"
                  >
                    Download Receipt
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-bold">Select Payment Type</h3>

            {/* Step 1: Select fee type */}
            {!selectedFeeType && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  onClick={() => handleFeeTypeSelection('Hostel Fee')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                >
                  Hostel Fee
                </button>
                <button
                  onClick={() => handleFeeTypeSelection('Meal Fee')}
                  className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                >
                  Meal Fee
                </button>
              </div>
            )}

            {/* Step 2: Show months if fee type is selected */}
            {selectedFeeType && (
              <div className="mt-6">
                <h4 className="font-bold text-lg">Select Month for {selectedFeeType}</h4>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {selectedFeeType === 'Hostel Fee' &&
                    selectedStudent.hostel_due_months.map((month, index) => (
                      <button
                        key={index}
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          selectedMonth === month ? 'bg-blue-500 text-white' : 'bg-gray-300'
                        }`}
                        onClick={() => handleMonthSelection(month)}
                      >
                        {month}
                      </button>
                    ))}
                  {selectedFeeType === 'Meal Fee' &&
                    selectedStudent.meal_due_months.map((month, index) => (
                      <button
                        key={index}
                        className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                          selectedMonth === month ? 'bg-orange-500 text-white' : 'bg-gray-300'
                        }`}
                        onClick={() => handleMonthSelection(month)}
                      >
                        {month}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="modal-action mt-6 flex justify-end">
              <button
                onClick={processPayment}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mr-2 transition-all duration-300"
              >
                Pay {selectedFeeType}
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
          <label className="modal-backdrop" onClick={() => setIsModalOpen(false)}></label>
        </div>
      )}
    </div>
  );
};

export default Fees;
