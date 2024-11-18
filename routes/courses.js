const express = require('express');
const router = express.Router();

// Course route
router.get('/courses', (req, res) => {
    res.render('course', { title: 'Courses' });
});

router.get('/course-single', (req, res) => {
    res.render('course-single', { title: 'Courses' });
});

module.exports = router;
