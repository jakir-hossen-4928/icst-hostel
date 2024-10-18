import React, { useState, useEffect, useRef, useCallback } from "react";
import SearchstudentCard from "./SearchstudentCard";
import { searchStudents } from "../../backend/appwrite";

const SearchStudentInfo = () => {
    const [searchQuery, setSearchQuery] = useState("");        // The current search query
    const [searchResults, setSearchResults] = useState([]);    // The loaded students
    const [isLoading, setIsLoading] = useState(false);         // Loading state
    const [recentSignups, setRecentSignups] = useState([]);    // Recent signups data
    const [page, setPage] = useState(0);                       // Current page for infinite scroll
    const [limit] = useState(10);                              // Limit for students per request
    const observer = useRef();                                 // To track the bottom element for infinite scrolling

    // Fetch recent signups when component mounts (for default data before searching)
    useEffect(() => {
        const fetchRecentSignups = async () => {
            setIsLoading(true);
            try {
                const defaultUsers = await searchStudents("", limit, 0); // Fetch recent signups
                setRecentSignups(defaultUsers); // Set recent signups
            } catch (error) {
                console.error("Error fetching recent students:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecentSignups();
    }, [limit]);

    // Fetch more students when scrolling reaches the bottom
    const loadMoreStudents = async () => {
        setIsLoading(true);
        try {
            const newResults = await searchStudents(searchQuery.trim(), limit, page * limit);
            setSearchResults((prevResults) => [...prevResults, ...newResults]);  // Append new results
            setPage((prevPage) => prevPage + 1);  // Increase page count for the next batch
        } catch (error) {
            console.error("Error loading more students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // IntersectionObserver callback to trigger loadMoreStudents when the bottom element is visible
    const lastStudentElementRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreStudents();  // Load more students when reaching the bottom
                }
            });
            if (node) observer.current.observe(node);  // Observe the last student card
        },
        [isLoading]
    );

    // Handle search
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;  // Avoid empty searches

        setIsLoading(true);
        try {
            setPage(0);  // Reset page count
            const data = await searchStudents(searchQuery.trim(), limit, 0);  // Fetch students for the search query
            setSearchResults(data);  // Reset the search results with new data
        } catch (error) {
            console.error("Error searching students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced search effect
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);  // Clear results if search query is empty
            return;
        }

        const timer = setTimeout(() => {
            handleSearch();  // Perform search after 300ms delay
        }, 300);

        return () => clearTimeout(timer);  // Clear timer on unmount
    }, [searchQuery]);

    return (
        <div className="p-5 md:p-11">
            <label className="mx-auto relative bg-white flex flex-col md:flex-row items-center justify-between border py-2 px-4 rounded-lg shadow-lg focus-within:border-gray-300" htmlFor="search-bar">
                <input
                    id="search-bar"
                    placeholder="Search by name or student Id"
                    className="px-4 py-2 w-full rounded-md outline-none bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}  // Update search query
                />
                <button
                    className={`w-full md:w-auto px-4 py-2 bg-black text-white rounded-lg transition-transform duration-200 ${isLoading ? "opacity-70" : "hover:bg-gray-800"}`}
                    onClick={handleSearch}
                    disabled={isLoading}
                >
                    <span className="text-sm font-semibold">Search</span>
                </button>
            </label>

            {isLoading && searchResults.length === 0 ? (
                <div className="flex justify-center items-center mt-5">
                    <div className="w-4 h-4 rounded-full animate-pulse bg-gray-300"></div>
                    <div className="w-4 h-4 rounded-full animate-pulse bg-gray-300"></div>
                    <div className="w-4 h-4 rounded-full animate-pulse bg-gray-300"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {searchQuery ? (
                        searchResults.length > 0 ? (
                            searchResults.map((card, index) => {
                                if (searchResults.length === index + 1) {
                                    return (
                                        <SearchstudentCard
                                            ref={lastStudentElementRef}  // Attach IntersectionObserver to the last student card
                                            key={card.$id}
                                            card={card}
                                        />
                                    );
                                } else {
                                    return <SearchstudentCard key={card.$id} card={card} />;
                                }
                            })
                        ) : (
                            <p className="text-center text-gray-600">No exact results found, showing nearby results</p>
                        )
                    ) : (
                        recentSignups.map((card, index) => {
                            if (recentSignups.length === index + 1) {
                                return (
                                    <SearchstudentCard
                                        ref={lastStudentElementRef}  // Attach IntersectionObserver to the last recent signup
                                        key={card.$id}
                                        card={card}
                                    />
                                );
                            } else {
                                return <SearchstudentCard key={card.$id} card={card} />;
                            }
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchStudentInfo;
