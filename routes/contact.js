const express = require('express');
const router = express.Router();

// About route
router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact' });
});

module.exports = router;
