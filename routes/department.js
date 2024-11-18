const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.fieldname + path.extname(file.originalname));
    }
});

// File filter to validate uploads
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'icon' || file.fieldname === 'images') {
        // Allow only image files
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
    }
    cb(null, true);
};

// Configure multer with file size limits
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 // 1MB
    }
}).fields([
    { name: 'icon', maxCount: 1 },
    { name: 'images', maxCount: 5 },
    { name: 'docs', maxCount: 5 }
]);

// Route to render the form
router.get('/add-department', (req, res) => {
    res.render('add-department', { title: "Add Department" });
});

// Route to handle form submission
router.post('/add-department', (req, res) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            console.error('Multer error:', err);
            return res.status(400).send(err.message);
        } else if (err) {
            // An unknown error occurred
            console.error('Unknown error:', err);
            return res.status(500).send(err.message);
        }

        try {
            const { name, description, addinfo } = req.body;

            // Process file paths
            const icon_url = req.files.icon ? `/uploads/${req.files.icon[0].filename}` : null;
            const images = req.files.images
                ? req.files.images.map(file => `/uploads/${file.filename}`).join(',')
                : '';
            const docs = req.files.docs
                ? req.files.docs.map(file => `/uploads/${file.filename}`).join(',')
                : '';

            // Insert data into the database
            const query = 'INSERT INTO departments (name, description, addinfo, icon_url, images, docs) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(query, [name, description, addinfo, icon_url, images, docs], (err, results) => {
                if (err) {
                    console.error('Database insertion error:', err);
                    return res.status(500).send('Error inserting data');
                }
                res.redirect('/departments');
            });
        } catch (error) {
            console.error('Error processing request:', error);
            res.status(500).send('Server error');
        }
    });
});

router.get('/departments', (req, res) => {
    const query = 'SELECT * FROM departments'; // Adjust table name based on your database schema
    db.query(query, (err, departments) => {
        if (err) {
            console.error('Database query error:', err); // Log error for debugging
            return res.status(500).send('Internal Server Error'); // Handle error gracefully
        }
         res.render('academic', {
            departments,
            title: 'Academic Departments'
        });
    });
});

// Route to display single department details
router.get('/department/:id', (req, res) => {
    const departmentId = req.params.id;

    // Query to get department details
    const departmentQuery = 'SELECT * FROM departments WHERE id = ?';

    // Query to get all departments for the sidebar
    const allDepartmentsQuery = 'SELECT id, name FROM departments';

    // Execute both queries
    db.query(departmentQuery, [departmentId], (err, department) => {
        if (err) {
            console.error('Error fetching department:', err);
            return res.status(500).send('Error fetching department details');
        }

        if (!department || department.length === 0) {
            return res.status(404).send('Department not found');
        }

        // Get all departments for sidebar
        db.query(allDepartmentsQuery, (err, allDepartments) => {
            if (err) {
                console.error('Error fetching all departments:', err);
                return res.status(500).send('Error fetching departments list');
            }

            // If documents exist, split them into an array
            const documents = department[0].docs ? department[0].docs.split(',') : [];
            // If images exist, split them into an array
            const images = department[0].images ? department[0].images.split(',') : [];

            res.render('academic-single', {
                department: department[0],
                allDepartments,
                documents,
                images,
                title: department[0].name,
                baseUrl: '/'
            });
        });
    });
});

// Faculty route
router.get('/faculties', (req, res) => {
    res.render('faculty', { title: 'Faculties' });
});

router.get('/faculty-single', (req, res) => {
    res.render('faculty-single', { title: 'Faculty' });
});

module.exports = router;