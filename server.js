const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(bodyParser.json());
app.use(require("cors")());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ankush3597@",  // change your password
  database: "mini_crm"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// Routes
//app.get("/", (req, res) => res.send("Mini CRM is running..."));
app.get("/health", (req, res) => res.send("✅ Mini CRM backend is running fine!"));
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
// ➕ Create Lead
app.post("/leads", (req, res) => {
  const { name, email, phone, status } = req.body;
  db.query(
    "INSERT INTO leads (name, email, phone, status) VALUES (?, ?, ?, ?)",
    [name, email, phone, status],
    (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: "Lead added", id: result.insertId });
    }
  );
});

// 📖 Get All Leads
app.get("/leads", (req, res) => {
  db.query("SELECT * FROM leads", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// ✏️ Update Lead Status
app.put("/leads/:id", (req, res) => {
  const { status } = req.body;
  db.query(
    "UPDATE leads SET status=? WHERE id=?",
    [status, req.params.id],
    (err) => {
      if (err) throw err;
      res.json({ message: "Lead updated" });
    }
  );
});

// ❌ Delete Lead
app.delete("/leads/:id", (req, res) => {
  db.query("DELETE FROM leads WHERE id=?", [req.params.id], (err) => {
    if (err) throw err;
    res.json({ message: "Lead deleted" });
  });
});
app.use(express.static("public"));
