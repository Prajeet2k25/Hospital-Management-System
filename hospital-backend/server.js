const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());

// ================= DATABASE CONNECTION =================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "hospital_db"
});

// ================= CONNECT DATABASE =================

db.connect((err) => {

    if (err) {

        console.log("❌ Database Connection Failed");
        console.log(err);

    } else {

        console.log("✅ MySQL Connected");
    }
});

// ================= HOME ROUTE =================

app.get("/", (req, res) => {

    res.send("Hospital Management API Running 🚀");
});

// ================= REGISTER API =================

app.post("/register", (req, res) => {

    const { name, email, password, phone } = req.body;

    const sql =
        "INSERT INTO users(name,email,password,phone) VALUES(?,?,?,?)";

    db.query(sql, [name, email, password, phone], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Registration Failed"
            });
        }

        res.status(200).json({
            success: true,
            message: "Registration Successful"
        });
    });
});

// ================= LOGIN API =================

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email=? AND password=?";

    db.query(sql, [email, password], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Login Failed"
            });
        }

        if (result.length > 0) {

            res.status(200).json({
                success: true,
                message: "Login Successful"
            });

        } else {

            res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }
    });
});

// ================= BOOK APPOINTMENT API =================

app.post("/book", (req, res) => {

    const { name, doctor, date } = req.body;

    const sql =
        "INSERT INTO appointments(name,doctor,date) VALUES(?,?,?)";

    db.query(sql, [name, doctor, date], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Appointment Booking Failed"
            });
        }

        res.status(200).json({
            success: true,
            message: "Appointment Booked Successfully"
        });
    });
});

// ================= VIEW APPOINTMENTS API =================

app.get("/appointments", (req, res) => {

    const sql = "SELECT * FROM appointments";

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Error Fetching Appointments"
            });
        }

        res.status(200).json(result);
    });
});

// ================= SERVER PORT =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);
});