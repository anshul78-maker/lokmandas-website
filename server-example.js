/*
 * Minimal backend reference for the Dr. Lokmandas Public School website.
 * Serves the static site and receives admission enquiries from the contact form.
 *
 *   npm init -y
 *   npm install express
 *   node server-example.js
 *   -> open http://localhost:3000
 *
 * The front-end posts JSON to POST /api/enquiry (see API_ENQUIRY in script.js):
 *   { name, phone, email, grade, message, submittedAt }
 * Replace the "save" step below with your database (your ERP already uses SQLite),
 * and/or send an email with nodemailer.
 */
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Serve index.html, styles.css, script.js and the img/ folder from this directory
app.use(express.static(__dirname));

// --- Admission enquiry endpoint ---
app.post('/api/enquiry', (req, res) => {
  const { name, phone, email, grade, message } = req.body || {};

  // basic validation
  if (!name || !String(name).trim()) {
    return res.status(400).json({ ok: false, error: 'Name is required.' });
  }

  const record = {
    name: String(name).trim().slice(0, 120),
    phone: String(phone || '').trim().slice(0, 30),
    email: String(email || '').trim().slice(0, 160),
    grade: String(grade || '').trim().slice(0, 40),
    message: String(message || '').trim().slice(0, 2000),
    submittedAt: new Date().toISOString(),
    ip: req.ip,
  };

  // --- Save it (demo: append to enquiries.jsonl) ---
  // Swap this for an INSERT into your SQLite/Postgres table, and/or send an email.
  try {
    fs.appendFileSync(path.join(__dirname, 'enquiries.jsonl'), JSON.stringify(record) + '\n');
  } catch (err) {
    console.error('Could not save enquiry:', err);
    return res.status(500).json({ ok: false, error: 'Could not save enquiry.' });
  }

  console.log('New admission enquiry from', record.name, record.phone || record.email);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log('Dr. Lokmandas website running on http://localhost:' + PORT));
