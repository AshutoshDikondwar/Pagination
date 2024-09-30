


import { NextResponse } from 'next/server';
import db from '../../../config/db';
import mysql, { ResultSetHeader } from 'mysql2';

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();
        if (!id) {
            return NextResponse.json({ error: 'Id is required' }, { status: 400 });
        }

        return new Promise((resolve) => {
            const query = `delete from students where student_id = ?`;

            db.query(query, [id], (err, results: ResultSetHeader) => {
                if (err) {
                    console.error('Error while deleting:', err);
                    return resolve(NextResponse.json({ error: 'Failed to delete data' }, { status: 500 }));
                }

                if (results.affectedRows > 0) {
                    return resolve(NextResponse.json({ message: 'Data deleted successfully' }, { status: 200 }));
                } else {
                    return resolve(NextResponse.json({ error: 'Student not found' }, { status: 404 }));
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}



export async function PUT(request: Request) {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const { name, address } = await request.json();

    return new Promise((resolve) => {
        const query = 'update students set name = ?, address = ? WHERE student_id = ?';
        db.query(query, [name, address, id], (err: mysql.QueryError | null, results: ResultSetHeader) => {

            if (err) {
                console.error('Error updating data:', err);
                return resolve(NextResponse.json({ error: 'Failed to update data' }, { status: 500 }));
            }
            if (results.affectedRows === 0) {
                return resolve(NextResponse.json({ error: 'No student found with the given id' }, { status: 404 }));
            }
            console.log('Data updated', results);
            return resolve(NextResponse.json({ message: 'Student updated successfully' }, { status: 200 }));

        })
    })

}