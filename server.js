/*const express = require("express");
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
*/
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// In-memory "database"
let leads = [];
let nextId = 1;

// Health check
app.get("/health", (req, res) =>
  res.send("✅ Mini CRM backend is running fine without SQL!")
);

// ➕ Create Lead
app.post("/leads", (req, res) => {
  const { name, email, phone, status } = req.body;
  const newLead = { id: nextId++, name, email, phone, status };
  leads.push(newLead);
  res.status(201).json({ message: "Lead added", id: newLead.id });
});

// 📖 Get All Leads
app.get("/leads", (req, res) => {
  res.json(leads);
});

// ✏️ Update Lead Status
app.put("/leads/:id", (req, res) => {
  const { status } = req.body;
  const lead = leads.find(l => l.id === parseInt(req.params.id));
  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }
  lead.status = status;
  res.json({ message: "Lead updated" });
});

// ❌ Delete Lead
app.delete("/leads/:id", (req, res) => {
  leads = leads.filter(l => l.id !== parseInt(req.params.id));
  res.json({ message: "Lead deleted" });
});

// Serve static frontend files if needed
app.use(express.static("public"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
