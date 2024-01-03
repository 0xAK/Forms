const express = require('express');
const mysql = require('mysql2');

const app = express();

// Configuring Express
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'formdb'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  const table = 'entry';
  const { user_name, user_email, user_message } = req.body;
  const sql = 'INSERT INTO ?? (name, email, message) VALUES (?, ?, ?)';
  const values = [table, user_name, user_email, user_message];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting record:', err);
      res.status(500).send('Error inserting record');
    } else {
      console.log('1 record inserted');
      res.redirect('/');
    }
  });
});

app.get('/messages', (req, res) => {
  const sql = 'SELECT * FROM entry';
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).send('Error retrieving data');
    } else {
      console.log(result);
      res.render('messages', { data: result });
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
