const express = require('express');
const cors = require('cors');
const booksRouter = require('./routes/tutorialsRouter');
const statusCodes = require('./constants/statusCodes')

const app = express();

app.use(cors());
// Parse incoming requests data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', booksRouter);

app.get('/', (req, res) => res.status(200).send({
  message: 'Api for tutorials',
}));

// Return 404 for nonexistent routes
app.use((req, res) => res.status(statusCodes.NOT_FOUND).send({
  statusCode: statusCodes.NOT_FOUND,
  success: false,
  errors: {
    message: 'Route not found'
  }
}));

module.exports = app;
