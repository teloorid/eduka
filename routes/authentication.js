const express = require('express');
const router = express.Router();

// Event route
router.get('/login', (req, res) => {
    res.render('login', { title: 'Log In' });
});

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Forgot Password' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

module.exports = router;
