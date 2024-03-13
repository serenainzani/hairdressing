import express from "express";
import pg from "pg";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "hairdressing",
    password: "postgres",
    port: 5433,
});

app.use(bodyParser.urlencoded({ extended: true }));

// ------------- Appointments -------------

// GET - ALL APPOINTMENT
app.get("/appointments", (req, res) => {
    const getAllQuery = `SELECT * FROM appointment`;
    pool.query(getAllQuery, (err, res2) => {
        if (err) {
            console.error("Error with query:", err.stack);
        } else {
            res.send(res2.rows);
        }
    });
});

app.get("/appointments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const getQuery = `SELECT * FROM appointment WHERE id = '${id}'`;
    pool.query(getQuery, (err, res2) => {
        if (err) {
            console.error("Error with query:", err.stack);
        } else {
            res.send(res2.rows[0]);
        }
    });
});

app.post("/appointments", (req, res) => {
    const customer_email = req.body.customer_email;
    const hairdresser_id = parseInt(req.body.hairdresser_id);
    const timestamp = req.body.date_time;
    const type = req.body.type;
    const postQuery = `INSERT INTO appointment (customer_email, hairdresser_id, date_time, type)
        VALUES (
            '${customer_email}',
            '${hairdresser_id}',
            '${timestamp}',
            '${type}'

        )`;
    pool.query(postQuery, (err, res2) => {
        if (err) {
            console.error("Error with query:", err.stack);
        } else {
            res.sendStatus(201);
        }
    });
});

app.delete("/appointments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const getQuery = `DELETE FROM appointment WHERE id = '${id}'`;
    pool.query(getQuery, (err, res2) => {
        if (err) {
            console.error("Error with query:", err.stack);
        } else {
            res.sendStatus(204);
        }
    });
});

// ------------- Hairdressers -------------

// GET - ALL HAIRDRESSERS
app.get("/hairdressers", (req, res) => {
    const getAllQuery = `SELECT * FROM hairdresser`;
    pool.query(getAllQuery, (err, res2) => {
        if (err) {
            console.error("Error with query:", err.stack);
        } else {
            res.send(res2.rows);
        }
    });
});

// GET - Single Customer
app.get("/hairdressers/:id", (req, res) => {
    const id = parseInt(decodeURIComponent(req.params.id));
    const getQuery = `SELECT * FROM hairdresser WHERE id = ${id}`;
    pool.query(getQuery, (err, res2) => {
        if (err) {
            console.error("Error with query:", err.stack);
        } else {
            res.send(res2.rows[0]);
        }
    });
});

// ------------- Customers -------------

// GET - All Customers
app.get("/customers", (req, res) => {
    const getAllQuery = `SELECT * FROM customer`;
    pool.query(getAllQuery, (err, res2) => {
        if (err) {
            console.error("Error with query:", err.stack);
        } else {
            res.send(res2.rows);
        }
    });
});

// GET - Single Customer
app.get("/customers/:email", (req, res) => {
    const email = decodeURIComponent(req.params.email);
    const getQuery = `SELECT * FROM customer WHERE email = '${email}'`;
    pool.query(getQuery, (err, res2) => {
        if (err) {
            console.error("Error with query:", err.stack);
        } else {
            res.send(res2.rows[0]);
        }
    });
});

// ------------- Treatments -------------

// GET - All Treatments
app.get("/treatments", (req, res) => {
    const getAllQuery = `SELECT * FROM treatment`;
    pool.query(getAllQuery, (err, res2) => {
        if (err) {
            console.error("Error with query:", err.stack);
        } else {
            res.send(res2.rows);
        }
    });
});

// GET - Single Treatment
app.get("/treatments/:id", (req, res) => {
    const treatment = parseInt(req.params.id);
    const getQuery = `SELECT * FROM treatment WHERE id = ${treatment}`;
    pool.query(getQuery, (err, res2) => {
        if (err) {
            console.error("Error with query:", err.stack);
        } else {
            res.send(res2.rows[0]);
        }
    });
});

// PATCH - Update single treatment
// TODO - Split this API into smaller functions, esp for the promises
app.patch("/treatments/:id", async (req, res) => {
    const treatment = req.body;
    const treatment_id = parseInt(req.params.id);
    const selectQuery = `SELECT * FROM treatment WHERE id = '${treatment_id}';`;
    const record = await new Promise((resolve, reject) => {
        pool.query(selectQuery, (err, res) => {
            if (err) {
                console.error("Error with query:", err.stack);
                reject(err);
            } else {
                let result = res.rows[0];
                resolve(result);
            }
        });
    });

    // Convert to comparable values for request body and sql record
    record.price = record.price.substring(1);
    record.minutes = record.minutes.toString();

    const filteredByValue = Object.fromEntries(
        Object.entries(treatment).filter(
            ([key, value]) => value !== record[key]
        )
    );

    const updateQueries = Object.entries(filteredByValue).map(([k, v]) => {
        // If statement for if value is a number or not, as that impacts the SQL statement
        // TODO - simplify update statement
        if (k === "minutes") {
            return `UPDATE treatment SET ${k} = ${parseInt(
                v
            )} WHERE id = ${treatment_id}`;
        } else if (k === "price") {
            return `UPDATE treatment SET ${k} = ${parseFloat(
                v
            )} WHERE id = ${treatment_id}`;
        } else {
            return `UPDATE treatment SET ${k} = '${v}' WHERE id = ${treatment_id}`;
        }
    });

    for (let i = 0; i < updateQueries.length; i++) {
        await new Promise((resolve, reject) => {
            pool.query(updateQueries[i], (err, res) => {
                if (err) {
                    console.error("Error with query:", err.stack);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
