const express = require("express");
const mysql = require("mysql2");
const cors = require("cors"); 
const app = express();

app.use(cors());                     // ✅ allow frontend to call API
app.use(express.json());


// MySQL connection
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Divyasri@2004",
    database: "company",
    port: 3306
});

// connect once when server starts
db.connect((err) => {
    if (err) {
        console.log("DB connection error:", err.message);
    } else {
        console.log("DB connected successfully!");
    }
});

// ----------------- BASIC TEST -----------------
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// ----------------- EMPLOYEE APIS -----------------

// GET all employees
app.get("/employees", (req, res) => {
    const sql = "SELECT * FROM employees";

    db.query(sql, (err, results) => {
        if (err) {
            console.log("Error in query:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// CREATE a new employee
app.post("/employees", (req, res) => {
    const {
        employee_code,
        full_name,
        email,
        phone,
        department,
        designation,
        salary,
        joining_date
    } = req.body;

    const sql = `
        INSERT INTO employees 
        (employee_code, full_name, email, phone, department, designation, salary, joining_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [employee_code, full_name, email, phone, department, designation, salary, joining_date],
        (err, result) => {
            if (err) {
                console.error("Error inserting employee:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(201).json({
                message: "Employee created",
                id: result.insertId
            });
        }
    );
});

// UPDATE an employee by id
app.put("/employees/:id", (req, res) => {
    const {
        employee_code,
        full_name,
        email,
        phone,
        department,
        designation,
        salary,
        joining_date
    } = req.body;

    const sql = `
        UPDATE employees
        SET employee_code = ?, full_name = ?, email = ?, phone = ?,
            department = ?, designation = ?, salary = ?, joining_date = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            employee_code,
            full_name,
            email,
            phone,
            department,
            designation,
            salary,
            joining_date,
            req.params.id
        ],
        (err, result) => {
            if (err) {
                console.error("Error updating employee:", err);
                return res.status(500).json({ error: "Database error" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Employee not found" });
            }
            res.json({ message: "Employee updated successfully" });
        }
    );
});

// DELETE employee by id
app.delete("/employees/:id", (req, res) => {
    const sql = "DELETE FROM employees WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Delete error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully" });
    });
});

// ----------------- TASK APIS (GET) -----------------

// GET all tasks
app.get("/tasks", (req, res) => {
    const sql = "SELECT * FROM tasks";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// CREATE a new task
app.post("/tasks", (req, res) => {
    const { employee_id, title, description, status, due_date } = req.body;

    const sql = `
        INSERT INTO tasks (employee_id, title, description, status, due_date)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [employee_id, title, description, status, due_date],
        (err, result) => {
            if (err) {
                console.error("Error inserting task:", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.status(201).json({
                message: "Task created",
                id: result.insertId
            });
        }
    );
});

// ✅ UPDATE a task by id
app.put("/tasks/:id", (req, res) => {
    const { employee_id, title, description, status, due_date } = req.body;

    const sql = `
        UPDATE tasks
        SET employee_id = ?, title = ?, description = ?, status = ?, due_date = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [employee_id, title, description, status, due_date, req.params.id],
        (err, result) => {
            if (err) {
                console.error("Error updating task:", err);
                return res.status(500).json({ error: "Database error" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Task not found" });
            }
            res.json({ message: "Task updated successfully" });
        }
    );
});

// ✅ DELETE a task by id
app.delete("/tasks/:id", (req, res) => {
    const sql = "DELETE FROM tasks WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error deleting task:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    });
});

// GET tasks by employee id
app.get("/employees/:id/tasks", (req, res) => {
    const sql = "SELECT * FROM tasks WHERE employee_id = ?";

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            console.error("Error fetching employee tasks:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});


// ----------------- START SERVER -----------------
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
