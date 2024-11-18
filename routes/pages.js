const express = require('express');
const router = express.Router();

// About route
router.get('/about', (req, res) => {
    res.render('about', { title: 'About Page' });
});

// Event routes
router.get('/events', (req, res) => {
    res.render('event', { title: 'Events' });
});

router.get('/event-single', (req, res) => {
    res.render('event-single', { title: 'Events' });
});

// Portfolio routes
router.get('/portfolio', (req, res) => {
    res.render('portfolio', { title: 'Portfolio' });
});

router.get('/portfolio-single', (req, res) => {
    res.render('portfolio-single', { title: 'Portfolio' });
});

// Teacher routes
router.get('/teachers', (req, res) => {
    res.render('teacher', { title: 'Teachers' });
});

router.get('/teacher-single', (req, res) => {
    res.render('teacher-single', { title: 'Teachers' });
});

// Gallery route
router.get('/gallery', (req, res) => {
    res.render('gallery', { title: 'Gallery' });
});

// Pricing route
router.get('/pricing', (req, res) => {
    res.render('pricing', { title: 'Pricing' });
});

// FAQ route
router.get('/faq', (req, res) => {
    res.render('faq', { title: 'Frequently Asked Questions' });
});

// Testimonials route
router.get('/testimonials', (req, res) => {
    res.render('testimonials', { title: 'Testimonials' });
});

// Terms of service route
router.get('/terms', (req, res) => {
    res.render('terms', { title: 'Terms and Conditions' });
});

// Privacy policy route
router.get('/privacy', (req, res) => {
    res.render('privacy', { title: 'Privacy' });
});

// Not found page routr
router.get('/404', (req, res) => {
    res.render('404', { title: 'Page Not Found' });
});

// Coming soon page route
router.get('/coming-soon', (req, res) => {
    res.render('coming-soon', { title: 'Coming Soon' });
});

module.exports = router;
