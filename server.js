const mysql = require('mysql2');
const express = require('express');
const inquirer = require('inquirer');

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password here
        password: 'password',
        database: 'employee_db'
      },
      console.log(`Connected to the employees_db database.`)
);

app.use((req, res) => {
    res.status(404).end();
});
  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});