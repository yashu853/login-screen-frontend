const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",      // Change if needed
    password: "12345",      // Change if needed
    database: "expense_tracker"
});

// ✅ Root route for testing
app.get("/", (req, res) => {
    res.send("✅ Backend is running!");
});

// ✅ Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: "Server error" });
            if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

            res.json({ token: "fake-jwt-token", user: { id: user.id, email: user.email } });
        });
    });
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
