"use client"

import { useEffect, useState } from "react";


interface Student {
    student_id: number;
    name: string;
    address: string;
}

interface PaginatedStudents {
    data: Student[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

interface GetStudentsProps {
    refreshKey: number;
}

const GetStudents = ({ refreshKey }: GetStudentsProps) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [keySearch, setKeySearch] = useState('');
    const [pageSize, setPageSize] = useState(3);


    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [editName, setEditName] = useState('');
    const [editAddress, setEditAddress] = useState('');

    const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [startPage, setStartPage] = useState(1);

    const handleNext = () => {
        if (startPage + 5 <= totalPages) {
            setStartPage(startPage + 5);
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (startPage > 1) {
            setStartPage(startPage - 5);
        }
        handlePageChange(currentPage - 1);
    };

    const fetchStudents = async (page: number = 1) => {
        try {
            const response = await fetch(`/api/student?page=${page}&limit=${pageSize}&keyword=${keySearch}`);
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const result: PaginatedStudents = await response.json();
            setStudents(result.data);
            setTotalPages(result.total_pages);
            setCurrentPage(result.page);
        } catch (err) {
            alert(err || 'Error getting Students');
        }
    };

    useEffect(() => {
        fetchStudents(currentPage);
    }, [currentPage, refreshKey, keySearch, pageSize]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "all") {
            setPageSize(Number.MAX_SAFE_INTEGER);
        } else {
            setPageSize(Number(value));
        }
        setCurrentPage(1);
    };

    const handleDeleteModal = (student_id: number) => {
        setDeleteStudentId(student_id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (deleteStudentId === null) return;

        try {
            const response = await fetch(`/api/student/${deleteStudentId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert("Deleted successfully");
                fetchStudents(currentPage);
            } else {
                throw new Error("Failed to delete student");
            }
        } catch (err) {
            console.error(err || "Error in deleting data");
        } finally {
            setShowDeleteModal(false);
            setDeleteStudentId(null);
        }
    };

    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        setEditName(student.name);
        setEditAddress(student.address);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;

        try {
            const response = await fetch(`/api/student/${editingStudent.student_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: editName, address: editAddress }),
            });

            if (!response.ok) {
                throw new Error('Failed to update student');
            }
            alert("Student updated successfully");
            setEditingStudent(null);
            fetchStudents(currentPage);
        } catch (err) {
            alert(err || 'An error occurred while updating the student');
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-4">Students List</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={keySearch}
                    onChange={(e) => setKeySearch(e.target.value)}
                    className="border rounded px-3 py-2 mr-2"
                />

                <select
                     value={pageSize === Number.MAX_SAFE_INTEGER ? "all" : pageSize}
                    onChange={handlePageSizeChange}
                    className="border rounded px-3 py-2 ml-2"
                >
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value="all">All</option>
                </select>
            </div>

            <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Student Id</th>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Address</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.student_id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{student.student_id}</td>
                            <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{student.address}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    onClick={() => handleEdit(student)}
                                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteModal(student.student_id)}
                                    className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-center items-center">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-white font-bold rounded ${currentPage === 1
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    Prev
                </button>

                {(() => {
                    const pageButtons = [];
                    const endPage = Math.min(startPage + 4, totalPages);

                    for (let i = startPage; i <= endPage; i++) {
                        pageButtons.push(
                            <button
                                key={i}
                                onClick={() => handlePageChange(i)}
                                className={`px-3 py-1 mx-1 rounded ${currentPage === i
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                {i}
                            </button>
                        );
                    }


                    if (endPage < totalPages) {
                        pageButtons.push(<span key="ellipsis" className="mx-1">...</span>);
                    }

                    return pageButtons;
                })()}

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-white font-bold rounded ${currentPage === totalPages
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    Next
                </button>
            </div>


            {editingStudent && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Edit Student</h3>
                    <form onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label htmlFor="editName" className="block text-sm font-medium text-gray-700">Name:</label>
                            <input
                                type="text"
                                id="editName"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="editAddress" className="block text-sm font-medium text-gray-700">Address:</label>
                            <input
                                type="text"
                                id="editAddress"
                                value={editAddress}
                                onChange={(e) => setEditAddress(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mr-2"
                            >
                                Update Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingStudent(null)}
                                className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
                        <p className="mb-4">Are you sure you want to delete this student?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GetStudents;