import pg from "pg";

const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "hairdressing",
    password: "postgres",
    port: 5433,
});

function insertData(queryString) {
    pool.query(queryString, (err, res) => {
        if (err) {
            console.error("Error executing query", err.stack);
        } else {
            console.log("Data inserted");
        }
    });
}

const queries = [
    `INSERT INTO customer (email, fname, lname, title) VALUES ('lynnie.jane@gmail.com', 'Lynnie', 'Jane', 'Ms');`,
    `INSERT INTO customer (email, fname, lname, title) VALUES ('tejalinz@hotmail.co.uk', 'Tejal', 'Inzani', 'Mrs');`,
    `INSERT INTO customer (email, fname, lname, title) VALUES ('topcat@catastic.cat','Speckles', 'Cat', 'Miss');`,
    `INSERT INTO hairdresser (fname, lname, title) VALUES ('Alex', 'Cuts', 'Mx');`,
    `INSERT INTO hairdresser (fname, lname, title) VALUES ('Jane', 'James', 'Mrs');`,
    `INSERT INTO hairdresser (fname, lname, title) VALUES ('Claud', 'Sheer', 'Mr');`,
    `INSERT INTO treatment (name, description, price, minutes) 
        VALUES (
            'CUT AND COLOUR',
            'Hair cut of any length, bleach, and colour of choice',
            129.99,
            150
        );`,
    `INSERT INTO treatment (name, description, price, minutes) 
        VALUES (
            'CUT AND BLOWDRY - LONG',
            'Long hair cut and blowdry',
            60,
            150
        );`,
    `INSERT INTO treatment (name, description, price, minutes) 
        VALUES (
            'SENIORS CUT AND BLOWDRY',
            'Senior special offer - 65+ years old.',
            40,
            150
        );`,
    `INSERT INTO appointment (customer_email, hairdresser_id, date_time, type_id)
        VALUES('lynnie.jane@gmail.com', 1, '1999-01-08 04:05:06', 2);`,
];

queries.forEach((query) => {
    insertData(query);
});

await pool.end();
