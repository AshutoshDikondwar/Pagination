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
        const query = `delete from students where student_id = ?`;

        const results: ResultSetHeader = await new Promise((resolve, reject) => {

            db.query(query, [id], (err, results: ResultSetHeader) => {
                if (err) {
                    console.error('Error while deleting:', err);
                    return reject(err);
                }
                return resolve(results);
            });
        });
        if (results.affectedRows == 0) {
            return NextResponse.json({ error: "No student found with the given id" }, { status: 404 });
        }
        return NextResponse.json({message:"Student deleted successfully"},{status:200})
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}



export async function PUT(request: Request) {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const { name, address } = await request.json();

    const query = 'update students set name = ?, address = ? WHERE student_id = ?';
    const results: ResultSetHeader = await new Promise((resolve, reject) => {
        db.query(query, [name, address, id], (err: mysql.QueryError | null, results: ResultSetHeader) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })

    })
    if (results.affectedRows === 0) {
        return NextResponse.json({ error: "No student found with the given id" }, { status: 404 });
    }
    return NextResponse.json({ message: "Student added successfully" }, { status: 200 })

}