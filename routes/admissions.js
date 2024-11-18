const express = require('express');
const router = express.Router();

// How to apply route
router.get('/how-to-apply', (req, res) => {
    res.render('how-to-apply', { title: 'How To Apply' });
});

// Application Form route
router.get('/application-form', (req, res) => {
    res.render('application-form', { title: 'Application Form' });
});

module.exports = router;
