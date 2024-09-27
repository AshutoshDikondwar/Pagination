import mysql from 'mysql2'

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ashu0311',
    database: 'testdb'
})

db.connect((err) => {
    if (err) {
        console.log("Error connecting to MySQL database", err);
    } else {
        console.log("Connected to MySQL database");
    }
})

export default db;