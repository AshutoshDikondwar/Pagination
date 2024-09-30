"use client"

import { useState } from "react";

interface PageProps{
    currentPage:number;
    totalPages:number;
    handlePageChange:(page: number) => void;
}

const Pagination = ({ currentPage, totalPages, handlePageChange }:PageProps) => {
    // State to keep track of the range of page numbers displayed
    const [startPage, setStartPage] = useState(1);

    // Function to handle the Next button click
    const handleNext = () => {
        if (startPage + 5 <= totalPages) {
            setStartPage(startPage + 5);
        }
        handlePageChange(currentPage + 1);
    };

    // Function to handle the Prev button click
    const handlePrev = () => {
        if (startPage > 1) {
            setStartPage(startPage - 5);
        }
        handlePageChange(currentPage - 1);
    };

    return (
        <div className="mt-4 flex justify-center items-center">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-white font-bold rounded ${
                    currentPage === 1
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                Prev
            </button>

            {/* Display the page numbers with ellipsis */}
            {(() => {
                const pageButtons = [];
                const endPage = Math.min(startPage + 4, totalPages); // Determine the end page based on startPage

                for (let i = startPage; i <= endPage; i++) {
                    pageButtons.push(
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`px-3 py-1 mx-1 rounded ${
                                currentPage === i
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            {i}
                        </button>
                    );
                }

                // Add ellipsis if there are more pages beyond the displayed range
                if (endPage < totalPages) {
                    pageButtons.push(<span key="ellipsis" className="mx-1">...</span>);
                }

                return pageButtons;
            })()}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-white font-bold rounded ${
                    currentPage === totalPages
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
