import React, { createContext, useEffect, useState } from 'react';
import { account ,getUserRoleInTeam} from '../backend/appwrite';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchUser = async () => {
        try {
            const userData = await account.get();
            setUser(userData);

            // Fetch roles
            const roles = await getUserRoleInTeam('6707cf82000f24efd40b');
            setIsAdmin(roles.includes('admin'));
        } catch (error) {
            setUser(null);
            setIsAdmin(false); // Clear admin state on logout
        } finally {
            setLoading(false);
        }
    };

    const clearUserState = () => {
        setUser(null); // Clear user data
        setIsAdmin(false); // Clear admin state
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, fetchUser, clearUserState }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
