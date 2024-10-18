import React, { useState } from 'react';
import * as xlsx from 'xlsx';
import { updateRoomSets, updateManagementCosts, updateStudents, updateHostelMealFee } from '../../backend/appwrite';

const FileUploadComponent = () => {
    const [sheetsData, setSheetsData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [activeUpdate, setActiveUpdate] = useState('');

    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: 'array' });

                let allSheetsData = {};
                workbook.SheetNames.forEach((sheetName) => {
                    const worksheet = workbook.Sheets[sheetName];
                    const json = xlsx.utils.sheet_to_json(worksheet);
                    allSheetsData[sheetName] = json;
                });

                setSheetsData(allSheetsData);
                console.log('google sheets all data',allSheetsData);
            };

            reader.readAsArrayBuffer(e.target.files[0]);
        }
    };



    const handleUpdate = async (updateFunction, updateName) => {
        console.log('Sheets Data:', sheetsData);
        setIsLoading(true);
        setActiveUpdate(updateName);

        try {
            await updateFunction(sheetsData);
            console.log('Shets-Data send colleciton',sheetsData);
        } catch (error) {
            console.error('Error during update:', error);
        } finally {
            setIsLoading(false);
            setActiveUpdate('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Upload Your Excel File</h2>

            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={readUploadFile}
                className="file-input file-input-bordered file-input-primary w-full max-w-xs mb-4"
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                    onClick={() => handleUpdate(updateRoomSets, 'Room Sets')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Update Room Sets
                </button>
                <button
                    onClick={() => handleUpdate(updateManagementCosts, 'Management Costs')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Update Management Costs
                </button>
                <button
                    onClick={() => handleUpdate(updateStudents, 'Students')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Update Students
                </button>
                <button
                    onClick={() => handleUpdate(updateHostelMealFee, 'Hostel Meal Fee')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Update Hostel Meal Fee
                </button>
            </div>

            {isLoading && (
                <div className="mt-6">
                    <p className="text-lg font-semibold text-blue-500">Updating {activeUpdate}...</p>
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full"></div>
                </div>
            )}
        </div>
    );
};

export default FileUploadComponent;
