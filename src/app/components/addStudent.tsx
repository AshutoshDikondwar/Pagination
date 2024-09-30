"use client"

import { useState } from "react"


interface AddStudentProps {
    onStudentAdded: () => void;
}

const AddStudent = ({ onStudentAdded }: AddStudentProps) => {


    const [name, setName] = useState('')
    const [address, setAddress] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !address) {
            alert('Both name and address are required.');
            return;
        }
        try {
            const response = await fetch('/api/student', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, address })
            })
            if (!response.ok) {
                throw new Error('Failed to add student');
            }
            alert("Student added successfully");
            onStudentAdded();
            setName('')
            setAddress('');

        } catch (err) {
            alert(err || 'An error occurred while adding the student');
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4 text-center">Add Student</h2>
            <form onSubmit={handleSubmit}>

                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
                    <input 
                        type="text" 
                        id="address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Add Student
                </button>

            </form>
        </div>
    )

}

export default AddStudent;