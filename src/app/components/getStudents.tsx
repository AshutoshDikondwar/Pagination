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
    const [nameSearch, setNameSearch] = useState('');
    const [addressSearch, setAddressSearch] = useState('');

    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [editName, setEditName] = useState('');
    const [editAddress, setEditAddress] = useState('');

    const fetchStudents = async (page: number = 1) => {
        try {
            const response = await fetch(`/api/student?page=${page}&limit=3&name=${nameSearch}&address=${addressSearch}`);
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const result: PaginatedStudents = await response.json();
            setStudents(result.data);
            setTotalPages(result.total_pages);
            setCurrentPage(result.page);
        } catch (err) {
            alert('Error getting Students');
        }
    };

    useEffect(() => {
        fetchStudents(currentPage);
    }, [currentPage, refreshKey, nameSearch, addressSearch, fetchStudents]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = async (student_id: number) => {
        try {
            const response = await fetch(`/api/student/${student_id}`, {
                method: "DELETE",
            });
            fetchStudents(currentPage);
        } catch (err) {
            console.log("Error in deleting data");
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
                    placeholder="Search by name"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    className="border rounded px-3 py-2 mr-2"
                />
                <input
                    type="text"
                    placeholder="Search by address"
                    value={addressSearch}
                    onChange={(e) => setAddressSearch(e.target.value)}
                    className="border rounded px-3 py-2"
                />
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
                                    onClick={() => handleDelete(student.student_id)}
                                    className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-white font-bold rounded ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    Prev
                </button>
                <span className="font-medium">{currentPage} / {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-white font-bold rounded ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
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

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                            Update Student
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default GetStudents;