const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a MongoDB schema and model
const querySchema = new mongoose.Schema({
  query: String
});

const Query = mongoose.model('Query', querySchema);

// Serve static files (your HTML form)
app.use(express.static(__dirname));

// Use middleware for JSON and form data parsing
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Define routes

// Display the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit', async (req, res) => {
  try {
    const { query } = req.body;

    // Create a new query document
    const newQuery = new Query({
      query
    });

    // Save the query to the database
    await newQuery.save();

    res.send('Query submitted successfully.');
  } catch (error) {
    console.error('Error submitting query:', error);
    res.status(500).send('Error submitting query.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
