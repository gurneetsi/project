const Query = require('../models/querymodel');

exports.submitQuery = async (req, res) => {
  try {
    const { name, email, phone, query } = req.body;
    const newQuery = new Query({ name, email, phone, query });
    await newQuery.save();
    res.send('Query submitted successfully.');
  } catch (error) {
    console.error('Error submitting query:', error);
    res.status(500).send('Error submitting query.');
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const queries = await Query.find().exec();
    res.render('dashboard', { queries });
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).send('Error fetching queries.');
  }
};

exports.deleteQuery = async (req, res) => {
  try {
    const queryId = req.params.id;
    await Query.findByIdAndRemove(queryId);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error deleting query:', error);
    res.status(500).send('Error deleting query.');
  }
};
