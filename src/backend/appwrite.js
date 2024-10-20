import { Client, Account, Databases, Permission, Role, Teams, Storage, ID, Query } from 'appwrite'; // Added Query import

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

// Initialize services
const account = new Account(client);
const databases = new Databases(client);
const teams = new Teams(client);
const storage = new Storage(client); // Use Storage class properly

const teamId = process.env.REACT_APP_TEAM_ID;
const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID;
const studentsCollectionId = process.env.REACT_APP_APPWRITE_STUDENTS_COLLECTION_ID;
const feedbackCollectionId = process.env.REACT_APP_APPWRITE_ADVISE_COMPLAIN_COLLECTION_ID;
const contactCollectionId = process.env.REACT_APP_APPWRITE_CONTACT_COLLECTION_ID;
const roomsCollectionId = process.env.REACT_APP_APPWRITE_ROOMS_SETS_COLLECTION_ID;
const noticesCollectionId = process.env.REACT_APP_APPWRITE_NOTICE_COLLECTION_ID;
const menagmentCostsCollectionId = process.env.REACT_APP_APPWRITE_MENAGMENT_COSTS_COLLECTION_ID;
const hostelmealfeeCollectionId = process.env.REACT_APP_APPWRITE_HOSTEL_MEAL_FEE_COLLECTION_ID;

const noticeImagesBucketId = process.env.REACT_APP_APPWRITE_NOTICE_IMAGES_BUCKET_ID;
const studentImagesBucketId = process.env.REACT_APP_APPWRITE_USER_PHOTOS_BUCKET_ID;



// console.log('Endpoint:', process.env.REACT_APP_APPWRITE_ENDPOINT);
// console.log('Project ID:', process.env.REACT_APP_APPWRITE_PROJECT_ID);
// console.log('Database ID:', databaseId);
// console.log('Students Collection ID:', studentsCollectionId);
// console.log('notices Collection ID:', noticesCollectionId);
// console.log('contact Collection ID:', contactCollectionId);
// console.log('hostelmealfee Collection ID:', hostelmealfeeCollectionId );
// console.log('feedback Collection Id Collection ID:', feedbackCollectionId);
// console.log('rooms Collection ID:', roomsCollectionId);
// console.log('manegments costs Collection ID:', menagmentCostsCollectionId);
// console.log('Notice Images Bucket ID:', noticeImagesBucketId);
// console.log('Student Images Bucket ID:', studentImagesBucketId);
// console.log('imgbb API Key:', process.env.REACT_APP_imgbb_key);




const hostelFixedFee = 1500;
// Extract month and year dynamically from some sheet, assuming it's in the first entry of Sheet1
const extractMonthYear = (sheetsData) => {
    const monthData = sheetsData['Sheet1'][0]['ICST Teacher\'s & Stuffs'];
    const monthYearMatch = monthData.match(/Month of ([A-Za-z]+),(\d{4})/);
    return monthYearMatch ? `${monthYearMatch[1]}-${monthYearMatch[2]}` : 'Unknown Month';
};
// Utility to generate a 6-character alphanumeric ID for students
const generateStudentId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};



// Create User Account
export const createUserAccount = async (email, password, name) => {
    try {
        const user = await account.create('unique()', email, password, name);
        return user;
    } catch (error) {
        console.error('Failed to create user:', error);
        throw error;
    }
};
// Login Function
export const loginUser = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.error('Failed to log in:', error);
        throw error;
    }
};
// Get User Role in the Team
export const getUserRoleInTeam = async (teamId) => {
    try {
        const user = await account.get();
        const memberships = await teams.listMemberships(teamId);

        const membership = memberships.memberships.find(m => m.userId === user.$id);

        if (membership) {
            return membership.roles;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Failed to get user role in team:', error);
        return [];
    }
};
// Logout Function
export const logoutUser = async () => {
    try {
        const session = await account.get();
        if (session) {
            await account.deleteSession('current');
            console.log("Successfully logged out");
        } else {
            console.log("No active session found.");
        }
    } catch (error) {
        console.error('Failed to log out:', error);
        throw error;
    }
};
// Send Password Reset Link
export const sendPasswordResetEmail = async (email) => {
    try {
        await account.createRecovery(email, `${window.location.origin}/setnewpassword`);
        console.log('Password reset email sent.');
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw error;
    }
};
// Set New Password Function
export const setNewPassword = async (userId, secret, newPassword, confirmPassword) => {
    try {
        await account.updateRecovery(userId, secret, newPassword, confirmPassword);
        console.log('Password reset successfully');
    } catch (error) {
        console.error('Failed to reset password:', error);
        throw error;
    }
};
// Change user password with validation
export const changeUserPassword = async (oldPassword, newPassword) => {
    try {
        await account.updatePassword(newPassword, oldPassword);
        console.log('Password updated successfully');
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};
// Fetch all notices from Appwrite database
export const fetchNotices = async () => {
    try {
        const notices = await databases.listDocuments(databaseId, noticesCollectionId);
        return notices.documents;
    } catch (error) {
        console.error("Error fetching notices:", error);
        throw error;
    }
};
// Fetch image URL for the notice
export const fetchNoticeImage = async (imageId) => {
    try {
        const result = await storage.getFilePreview(noticeImagesBucketId, imageId);
        return result.href; // Return the image URL
    } catch (error) {
        console.error("Error fetching image:", error);
        throw error;
    }
};
// Create Notice
export const createNotice = async (title, description, category, date, imageFile) => {
    try {
        let imageURL = null;

        // If an image file is provided, upload it to the storage bucket
        if (imageFile) {
            const uploadedFile = await storage.createFile(noticeImagesBucketId, ID.unique(), imageFile);
            imageURL = `https://cloud.appwrite.io/v1/storage/buckets/${noticeImagesBucketId}/files/${uploadedFile.$id}/view?project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}`;
        }

        // Create the notice document in the database
        const notice = await databases.createDocument(databaseId, noticesCollectionId, ID.unique(), {
            notice_title: title,
            notice_description: description,
            notice_category: category,
            image: imageURL,
            date: date,
        });

        return notice;
    } catch (error) {
        console.error('Failed to create notice:', error);
        throw error;
    }
};
// Update an existing notice
export const updateNotice = async (noticeId, title, description, category) => {
    try {
        const updatedNotice = await databases.updateDocument(
            databaseId,
            noticesCollectionId,
            noticeId,
            {
                notice_title: title,
                notice_description: description,
                notice_category: category, // Pass category in the update request
            }
        );
        return updatedNotice;
    } catch (error) {
        console.error("Failed to update notice:", error);
        throw error;
    }
};
// Delete an existing notice
export const deleteNotice = async (noticeId) => {
    try {
        await databases.deleteDocument(databaseId, noticesCollectionId, noticeId);
    } catch (error) {
        console.error("Failed to delete notice:", error);
        throw error;
    }
};

// Submit user feedback (advice or complaint)
export const submitFeedback = async (description, category, dateTime, user) => {
    try {
        const feedbackDocument = await databases.createDocument(
            databaseId, // Database ID
            feedbackCollectionId, // Feedback collection ID
            ID.unique(), // Unique document ID
            {
                description: description,
                category: category,
                date: dateTime,
                userId: user.$id,
                name: user.name,
                email: user.email,
                status: 'pending'
            }
        );
        return feedbackDocument;
    } catch (error) {
        console.error("Error submitting feedback:", error);
        throw error;
    }
};
// Function to fetch feedback by user ID and status (pending or resolved)
export const fetchFeedbackByUserId = async (userId, status = 'pending') => {
    try {
      const response = await databases.listDocuments(
        process.env.REACT_APP_APPWRITE_DATABASE_ID,
        process.env.REACT_APP_APPWRITE_ADVISE_COMPLAIN_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.equal('status', status), // Fetch feedback based on status
        ]
      );
      return response.documents;
    } catch (error) {
      console.error(`Error fetching feedback: ${error.message}`);
      throw new Error(`Error fetching feedback: ${error.message}`);
    }
  };
// Fetch all feedback from Appwrite database
export const fetchFeedback = async () => {
    try {
        const response = await databases.listDocuments(databaseId, feedbackCollectionId);
        return response.documents; // Return the feedback documents
    } catch (error) {
        console.error("Error fetching feedback:", error);
        throw error;
    }
};
// Resolve feedback by ID and update its status
export const resolveFeedback = async (feedbackId) => {
    console.log("Resolving feedback with ID:", feedbackId); // Debug log
    try {
        if (!feedbackId) {
            throw new Error("Missing feedback ID");
        }

        await databases.updateDocument(databaseId, feedbackCollectionId, feedbackId, {
            status: "resolved",
        });
        console.log("Feedback resolved successfully");
    } catch (error) {
        console.error("Failed to resolve feedback:", error);
        throw error;
    }
};
// Delete feedback by ID
export const deleteFeedback = async (feedbackId) => {
    console.log("Deleting feedback with ID:", feedbackId); // Debug log
    try {
        if (!feedbackId) {
            throw new Error("Missing feedback ID");
        }

        await databases.deleteDocument(databaseId, feedbackCollectionId, feedbackId);
        console.log("Feedback deleted successfully");
    } catch (error) {
        console.error("Failed to delete feedback:", error);
        throw error;
    }
};
// Store contact data in Appwrite
export const storeContactData = async (fullName, email, phoneNumber, message) => {
    try {
        const contactDocument = await databases.createDocument(
            process.env.REACT_APP_APPWRITE_DATABASE_ID,
            process.env.REACT_APP_APPWRITE_CONTACT_COLLECTION_ID,
            ID.unique(),
            {
                ful_name: fullName,
                email: email,
                phoneNumber: phoneNumber,
                message: message,
            }
        );
        return contactDocument;
    } catch (error) {
        console.error('Error storing contact data:', error.response ? error.response.message : error.message);
        throw error;
    }
};
export const fetchContacts = async () => {
    try {
        const response = await databases.listDocuments(databaseId, contactCollectionId);
        return response.documents; // Return the contact documents
    } catch (error) {
        console.error("Error fetching contacts:", error);
        throw error;
    }
};
// Delete a contact by ID
export const deleteContact = async (contactId) => {
    try {
        await databases.deleteDocument(databaseId, contactCollectionId, contactId);
        console.log("Contact deleted successfully");
    } catch (error) {
        console.error("Failed to delete contact:", error);
        throw error;
    }
};
// Fetch all rooms data with pagination
export const fetchRooms = async (offset = 0, limit = 100) => {
    try {
        const rooms = await databases.listDocuments(
            databaseId,//database id
             roomsCollectionId,//rooms collection id
            [Query.limit(limit), Query.offset(offset)]
        );
        return rooms.documents;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
};
// Store student data in the students collection
export const storeStudentData = async (studentData) => {
    try {
      console.log("Student Data to be stored:", studentData);

      const studentDataToStore = {
        ...studentData,
        photo: studentData.photo, // Store the photo URL directly
      };

      const response = await databases.createDocument(
        databaseId,
        studentsCollectionId,
        ID.unique(),
        studentDataToStore,
        [
          Permission.write(Role.user(studentData.userId)), // Write permission for the user
          Permission.read(Role.any()), // Read permission for anyone (optional)
        ]
      );

      return response;
    } catch (error) {
      throw new Error('Failed to store student data: ' + error.message);
    }
  };
export const checkUserProfileExists = async (userId) => {
    try {
        const response = await databases.listDocuments(
            databaseId,
            studentsCollectionId, // Corrected to use studentsCollectionId
            [Query.equal("userId", userId)]
        );
        return response.total > 0; // Return true if any documents exist
    } catch (error) {
        console.error('Failed to check user profile existence:', error);
        throw new Error('Failed to check user profile existence: ' + error.message);
    }
};
export const searchStudents = async (searchQuery = "", limit = 100, offset = 0) => {
    try {
        const queries = [];

        if (searchQuery) {
            // Main search query across multiple fields
            queries.push(
                Query.or([
                    Query.search('name', searchQuery),
                    Query.search('email', searchQuery),
                    Query.search('studentId', searchQuery),
                    Query.search('institute', searchQuery),
                    Query.search('number', searchQuery)
                ])
            );
        }

        // Add query for sorting by creation date
        queries.push(Query.orderDesc('$createdAt'));

        console.log("Search Queries:", queries); // For debugging

        // Fetch documents from the Appwrite database with pagination (limit & offset)
        const response = await databases.listDocuments(
            databaseId,
            studentsCollectionId,
            queries,
            { limit, offset }
        );

        // If no exact matches found, perform a secondary search for nearby results
        if (response.documents.length === 0) {
            console.log("No exact results found, fetching nearby results...");

            // Secondary search for "nearby" data across all attributes
            const nearbyQueries = Query.or([
                Query.search('name', searchQuery),
                Query.search('email', searchQuery),
                Query.search('studentId', searchQuery),
                Query.search('institute', searchQuery),
                Query.search('number', searchQuery)
            ]);

            // Fetch nearby documents
            const nearbyResponse = await databases.listDocuments(
                databaseId,
                studentsCollectionId,
                [Query.orderDesc('$createdAt')].concat(nearbyQueries),  // Relaxed query on all attributes
                { limit, offset }
            );
            return nearbyResponse.documents;  // Return nearby results
        }

        // Return exact search results
        return response.documents;

    } catch (error) {
        console.error("Error searching students:", error);
        throw error;
    }
};
// Function to fetch logged-in user data
export const getUserData = async () => {
    try {
        // Fetch logged-in user's basic account info
        const user = await account.get();

        // Fetch additional user details from the database
        const userId = user.$id;
        const response = await databases.listDocuments(databaseId, studentsCollectionId, [
            Query.equal('userId', userId)
        ]);

        // Assuming only one record matches the userId
        const userDetails = response.documents[0];

        return {
            documentId: userDetails.$id,
            name: userDetails.name,            // Name of the student
            email: user.email,                 // Email (from account info)
            studentId: userDetails.studentId,  // Student ID
            institute: userDetails.institute,  // Institute
            number: userDetails.number,        // Contact number
            fatherNumber: userDetails.fatherNumber,
            motherNumber: userDetails.motherNumber,
            semester: userDetails.semester,    // Semester
            userId: userDetails.userId,        // User ID (same as userId fetched from account)
            photo: userDetails.photo,          // Photo URL
            room: userDetails.room             // Room number
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};
export const getManagementCosts = async () => {
    try {
      // Fetch all documents without filtering
      const response = await databases.listDocuments(databaseId, menagmentCostsCollectionId);
      return response.documents; // Return all documents
    } catch (error) {
      console.error("Error fetching management costs:", error);
      throw new Error('Failed to fetch management costs');
    }
  };
export const updateManagementCosts = async (sheetsData) => {
    const costData = sheetsData['Sheet3'];
    const accountedMonth = extractMonthYear(sheetsData); // Extract month-year dynamically

    if (!Array.isArray(costData)) {
        console.error('Management Costs data is not an array or does not exist:', costData);
        return;
    }

    // Helper function to convert Excel serial date to a JavaScript Date
    const excelSerialDateToJSDate = (serialDate) => {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's base date is 30 Dec 1899
        const jsDate = new Date(excelEpoch.getTime() + serialDate * 24 * 60 * 60 * 1000); // Add serial days to the base date
        return jsDate;
    };

    // Initialize variables
    let previousStock = 0;
    let stdTotalCollection = 0;
    let teacherCollection = 0;
    let totalCost = 0;
    let totalMealsServed = 0;
    let guestTaka = 0;
    let perMealCost = 0;
    let shoppingData = [];
    let teacherMealsData = [];
    let currentStock = 0; // Added currentStock variable
    let others = 0; // Added others variable

    // Extract data from Sheet3
    for (let entry of costData) {
        // Check for Previous Stock
        if (entry.Date === 'Previous Stock') {
            previousStock = Number(entry.Shopping) || 0;
        }

        // Check for Std Total Collection (Make sure this extraction is correct)
        else if (entry.Date === 'Std Total Collection') {
            stdTotalCollection = Number(entry.Shopping) || 0;
        }

        // Check for Total Cost
        else if (entry.Date === 'Total Cost') {
            totalCost = Number(entry.Shopping) || 0;
        }

        // Check for Guest Taka
        else if (entry.Date === 'Guest Taka') {
            guestTaka = Number(entry.Shopping) || 0;
        }

        // Check for Per Meal Cost
        else if (entry.Date === 'Per Meal Cost') {
            perMealCost = Number(entry.Shopping) || 0;
        }

        // Check for Total Meal
        else if (entry.Date === 'Total Meal') {
            totalMealsServed = Number(entry.Shopping) || 0;
        }

        // Check for Current Stock
        else if (entry.Date === 'Current Stock') {
            currentStock = Number(entry.Shopping) || 0;
        }

        // Check for Others
        else if (entry.Date === 'Others') {
            others = Number(entry.Shopping) || 0; // Capture "Others" value
        }

        // Handle shopping data and filter out non-date entries
        else if (entry.Date !== undefined && entry.Shopping !== undefined) {
            const dateSerial = Number(entry.Date);

            // Convert Excel serial date to JS date
            const date = excelSerialDateToJSDate(dateSerial);

            // Only push valid dates to shoppingData
            if (!isNaN(date.getTime()) && !isNaN(Number(entry.Shopping))) {
                shoppingData.push({
                    date: date.toLocaleDateString('en-US'), // Convert date to 'MM/DD/YYYY'
                    amount: Number(entry.Shopping) || 0
                });
            } else {
                console.warn('Invalid date found:', entry.Date);
            }
        }
    }

    // Extract data for `teacherMealsData` from Sheet1
    const teacherData = sheetsData['Sheet1'].filter(row => row.__EMPTY_1);
    teacherMealsData = teacherData.map(teacher => {
        const meals = Number(teacher.__EMPTY_2) || 0;
        const totalCost = Number(teacher.__EMPTY_5) || 0;
        const designation = teacher.__EMPTY || 'Unknown'; // Capture Designation
        teacherCollection += meals;
        return {
            name: teacher.__EMPTY_1 || 'Unknown',
            designation,
            totalMeals: meals,
            perMealCost: perMealCost,
            totalCost // Capture total cost
        };
    });

    // Convert both arrays to JSON strings before storing
    const shoppingDataString = JSON.stringify(shoppingData);
    const teacherMealsDataString = JSON.stringify(teacherMealsData);

    // Debugging logs to check values before document creation
    console.log('Previous Stock:', previousStock);
    console.log('Standard Total Collection (Before Saving):', stdTotalCollection);
    console.log('Teacher Collection:', teacherCollection);
    console.log('Total Cost:', totalCost);
    console.log('Total Meals Served:', totalMealsServed);
    console.log('Guest Taka:', guestTaka);
    console.log('Per Meal Cost:', perMealCost);
    console.log('Current Stock:', currentStock); // Log currentStock
    console.log('Others:', others); // Log Others
    console.log('Shopping Data:', shoppingData);
    console.log('Teacher Meals Data:', teacherMealsData);

    try {
        const costId = ID.unique();
        await databases.createDocument(databaseId, menagmentCostsCollectionId, costId, {
            previousStock,
            stdTotalCollection: parseFloat(stdTotalCollection.toFixed(2)),
            teacherCollection: parseFloat(teacherCollection.toFixed(2)),
            totalCost,
            totalMealsServed,
            guestTaka,
            perMealCost: parseFloat(perMealCost.toFixed(2)),
            currentStock, // Save currentStock value
            others, // Save the "Others" value
            shoppingData: shoppingDataString,
            teacherMealsData: teacherMealsDataString, // Store teacher meals data as string
            accounted_month: accountedMonth
        });

        console.log('Management costs successfully updated.');

    } catch (error) {
        console.error('Error updating management costs:', error);
    }
};
export const updateRoomSets = async (sheetsData) => {
    // Extract the relevant data from the sheets
    const roomData = sheetsData['Sheet2'];

    // Initialize variables to track current room and students
    let currentRoomNumber = null;
    let currentStudentNames = [];
    let roomUpdates = {};

    // Process each entry in the room data
    for (let entry of roomData) {
        const roomNumber = entry['__EMPTY']; // Room No
        const studentName = entry['__EMPTY_2']; // Student Name

        // If we encounter a new room number and we have data for the previous room
        if (roomNumber && currentRoomNumber && currentRoomNumber !== roomNumber) {
            // Store the previous room's data
            roomUpdates[currentRoomNumber] = {
                occupied_seats: currentStudentNames.length,
                studentNames: [...currentStudentNames] // Store as an array, not a string
            };

            // Reset for the new room
            currentRoomNumber = roomNumber;
            currentStudentNames = [];
        }

        // If the current entry is a room number, set it as the current room
        if (roomNumber && !currentRoomNumber) {
            currentRoomNumber = roomNumber;
        }

        // Add the student to the current room
        if (studentName) {
            currentStudentNames.push(studentName);
        }
    }

    // Handle the last room's data (after the loop ends)
    if (currentRoomNumber) {
        roomUpdates[currentRoomNumber] = {
            occupied_seats: currentStudentNames.length,
            studentNames: [...currentStudentNames] // Store as an array
        };
    }

    // Now update each room in the database
    for (let roomNumber in roomUpdates) {
        const { occupied_seats, studentNames } = roomUpdates[roomNumber];

        // Fetch the document ID based on the room number
        const documentId = await getDocumentIdByRoomNumber(roomNumber);

        if (documentId) {
            // Reset the existing data before updating
            await deleteExistingDataForRoom(documentId);

            // Update the room in the Appwrite database
            await databases.updateDocument(databaseId, roomsCollectionId, documentId, {
                occupied_seats, // Number of students
                student_in_room: studentNames // Pass as an array
            });
        } else {
            console.log(`Room ${roomNumber} does not exist in the database`);
        }
    }
};
// Function to delete existing data for the room
const deleteExistingDataForRoom = async (documentId) => {
    await databases.updateDocument(databaseId, roomsCollectionId, documentId, {
        occupied_seats: 0, // Reset to zero
        student_in_room: [] // Clear existing student names as an array
    });
};
// Helper function to fetch document ID by room number
const getDocumentIdByRoomNumber = async (roomNumber) => {
    const response = await databases.listDocuments(databaseId, roomsCollectionId, [
        Query.equal('room_number', roomNumber)
    ]);

    return response.documents.length ? response.documents[0].$id : null;
};
export const updateStudentProfile = async (documentId, updatedData) => {
    try {
        // Proceed with updating the document if found
        const updatedProfile = await databases.updateDocument(
            databaseId,
            studentsCollectionId,
            documentId,  // Document ID for identifying the document
            updatedData  // Only send valid fields
        );
        return updatedProfile;
    } catch (error) {
        if (error.code === 404) {
            console.error(`Document with ID ${documentId} not found.`);
        } else {
            console.error('Error updating profile:', error.message);
        }
        throw error;
    }
};
// To verify documents:
export const listAllDocuments = async () => {
    try {
        const documents = await databases.listDocuments(databaseId, studentsCollectionId);
        console.log("Documents available in collection:", documents.documents);
    } catch (error) {
        console.error("Error listing documents:", error.message);
    }
};
// Validate form inputs (basic example)
export const validateProfileData = (data) => {
    const { name, email, number, semester } = data;
    if (!name || !email || !number || !semester) {
        return false;
    }
    // Additional validation can be added as per requirements
    return true;
};































// Function to update `students` collection
export const updateStudents = async (sheetsData) => {
    const studentsData = sheetsData['Students'];
    for (let student of studentsData) {
        const studentExists = await databases.listDocuments(databaseId, studentsCollectionId, [
            Query.equal('email', student.email)
        ]);

        // If student doesn't exist, create a new one
        if (studentExists.total === 0) {
            const studentId = generateStudentId();
            await databases.createDocument(databaseId, studentsCollectionId, ID.unique(), {
                name: student.name,
                email: student.email,
                studentId: studentId,
                institute: student.Dept, // Use 'Dept' from JSON as 'institute'
                number: student.number,
                semester: student.semester,
                room: student.room,
                userId: student.userId,
                photo: student.photo
            });
        }
    }
};

// Function to update `hostel_meal_fee` collection
export const updateHostelMealFee = async (sheetsData) => {
    const studentsData = sheetsData['Students'];
    for (let student of studentsData) {
        const mealFee = student.meal_fee; // Get meal fee from JSON data
        const totalFee = hostelFixedFee + mealFee;

        await databases.createDocument(databaseId, hostelmealfeeCollectionId, ID.unique(), {
            studentId: student.studentId,
            mealFee: mealFee,
            totalFee: totalFee,
            transaction_history: JSON.stringify(student.transactions) // Save transaction history as JSON
        });
    }
};











export { account, client, databases, storage ,ID };
