const express = require('express');
const router = express.Router();

// Campus routes
router.get('/campus-life', (req, res) => {
    res.render('campus-life', { title: 'Campus Life' });
});

router.get('/campus-tour', (req, res) => {
    res.render('campus-tour', { title: 'Campus Tour' });
});

// Notice Board route
router.get('/notice-board', (req, res) => {
    res.render('notice-board', { title: 'Notice Board' });
});

// Student activities route
router.get('/student-activities', (req, res) => {
    res.render('student-activities', { title: 'Student Activities' });
});

// Facilities route
router.get('/facilities', (req, res) => {
    res.render('facility', { title: 'Facilities' });
});

router.get('/facility-single', (req, res) => {
    res.render('facility-single', { title: 'Facility' });
});

// Research route
router.get('/research', (req, res) => {
    res.render('research', { title: 'Research' });
});

router.get('/research-single', (req, res) => {
    res.render('research-single', { title: 'Research' });
});

// Clubs route
router.get('/clubs', (req, res) => {
    res.render('club', { title: 'Clubs' });
});

router.get('/club-single', (req, res) => {
    res.render('club-single', { title: 'Clubs' });
});

// Tuition Fees route
router.get('/tuition-fees', (req, res) => {
    res.render('tuition-fee', { title: 'Tuition Fee' });
});

// Alumni route
router.get('/alumni', (req, res) => {
    res.render('alumni', { title: 'Alumni' });
});

// Scholarship routes
router.get('/scholarships', (req, res) => {
    res.render('scholarship', { title: 'Scholarships' });
});

// Our fund route
router.get('/our-fund', (req, res) => {
    res.render('our-fund', { title: 'Our Fund' });
});

// Athletics route
router.get('/athletics', (req, res) => {
    res.render('athletics', { title: 'Athletics' });
});

// Health care route
router.get('/health-care', (req, res) => {
    res.render('health-care', { title: 'Health Care' });
});

module.exports = router;
