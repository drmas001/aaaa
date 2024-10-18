const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path'); // إضافة path للتعامل مع المسارات
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build'))); // خدمة ملفات البناء

// Routes
app.get('/api/patients', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM patients');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// المسار الرئيسي للتطبيق
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ... (يمكنك إضافة المزيد من المسارات حسب الحاجة)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
