import mysql from 'mysql2'

const db = mysql.createConnection({
    host: 'autorack.proxy.rlwy.net',
    user: 'root',
    password: 'syaPWFmwGaOMWHoVZiTaAjPxtEfwVKLE',
    database: 'railway',
    port:48931
})

db.connect((err) => {
    if (err) {
        console.log("Error connecting to MySQL database", err);
    } else {
        console.log("Connected to MySQL database");
    }
})

export default db;