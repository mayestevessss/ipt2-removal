import React, { useState } from 'react';

const SearchFilter = ({ searchTerm, onSearch, onClear }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Handle input change
    const handleChange = (e) => {
        setLocalSearchTerm(e.target.value);
    };

    // Handle search button click
    const handleSearch = () => {
        onSearch(localSearchTerm);
    };

    // Handle clear button click
    const handleClear = () => {
        setLocalSearchTerm('');
        onClear();
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="filter-section">
            <h2>Filter Products</h2>
            <div className="search-box">
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Search by product name..."
                    value={localSearchTerm}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                />
                <button
                    className="btn btn-search"
                    onClick={handleSearch}
                >
                    Search
                </button>
                <button
                    className="btn btn-clear"
                    onClick={handleClear}
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SearchFilter;
