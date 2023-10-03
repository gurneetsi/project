const express = require('express');
const router = express.Router();
const queryController = require('./controllers/querycontroller');
const emailController = require('./controllers/emailcontroller');

router.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
router.post('/submit', queryController.submitQuery);
router.get('/dashboard', queryController.getDashboard);
router.post('/delete/:id', queryController.deleteQuery);
router.post('/send-email', emailController.sendEmail);

module.exports = router;
