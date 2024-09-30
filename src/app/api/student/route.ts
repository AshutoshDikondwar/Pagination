import { NextResponse } from 'next/server';
import db from '../../config/db';
import mysql, { ResultSetHeader } from 'mysql2';

interface Student {
    student_id: number;
    name: string;
    address: string;
}

export async function POST(request: Request) {
    const { name, address } = await request.json();

    const results: ResultSetHeader = await new Promise((resolve, reject) => {
        const query = 'insert into students(name,address) values(?,?)';
        db.query(query, [name, address], (err, results: ResultSetHeader) => {
            if (err) {
                console.error('Error inserting data:', err);
                return reject(err)
            }
            console.log('Data inserted', results);
            return resolve(results);
        })
        return NextResponse.json({ message: 'Student added successfully', id: results.insertId }, { status: 201 })


    })
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '5';

    const name = searchParams.get('name');
    const address = searchParams.get('address');

    const offset = (Number(page) - 1) * Number(limit);

    return new Promise((resolve) => {
        let query = 'select * from students';
        const queryParams: Array<string | number> = [] = [];

        if (name || address) {
            query += ' WHERE';
            const conditions: string[] = [];
            if (name) {
                conditions.push('name LIKE ?');
                queryParams.push(`%${name}%`);
            }

            if (address) {
                conditions.push('address LIKE ?');
                queryParams.push(`%${address}%`);
            }

            query += ' ' + conditions.join(' OR ');
        }

        query += ' limit ? offset ?';
        queryParams.push(Number(limit), offset);
        db.query(query, queryParams, (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return resolve(NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 }));
            }
            const students = results as Student[];
            let total_query = 'select count(student_id) as total from students';
            const countParams: Array<string | number> = [] = [];

            if (name || address) {
                total_query += ' WHERE';
                const countConditions: string[] = [];

                if (name) {
                    countConditions.push('name LIKE ?');
                    countParams.push(`%${name}%`);
                }

                if (address) {
                    countConditions.push('address LIKE ?');
                    countParams.push(`%${address}%`);
                }

                total_query += ' ' + countConditions.join(' OR ');
            }

            db.query(total_query, countParams, (count_err: mysql.QueryError | null, count_result) => {
                if (count_err) {
                    console.error('Error fetching count:', count_err);
                    return resolve(NextResponse.json({ error: 'Failed to fetch total count' }, { status: 500 }));
                }
                const cResult = count_result as { total: number }[];
                const total_students = cResult[0].total;
                const total_pages = Math.ceil(total_students / Number(limit));
                return resolve(
                    NextResponse.json({
                        data: students,
                        total: total_students,
                        page: Number(page),
                        limit: Number(limit),
                        total_pages
                    })
                );
            })
        })
    })
}