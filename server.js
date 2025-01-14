const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

// Add initial error logging
console.log('Starting server initialization...');

try {
    //Import Routes - Wrap in try-catch to see which route is failing
    console.log('Loading routes...');
    const admissionsRoutes = require('./routes/admissions');
    console.log('Loaded admissions routes');
    const authenticationRoutes = require('./routes/authentication');
    console.log('Loaded authentication routes');
    const blogRoutes = require('./routes/blog');
    console.log('Loaded blog routes');
    const campusRoutes = require('./routes/campus');
    console.log('Loaded campus routes');
    const contactRoutes = require('./routes/contact');
    console.log('Loaded contact routes');
    const courseRoutes = require('./routes/courses');
    console.log('Loaded course routes');
    const departmentRoutes = require('./routes/department');
    console.log('Loaded department routes');
    const homeRoutes = require('./routes/home');
    console.log('Loaded home routes');
    const pageRoutes = require('./routes/pages');
    console.log('Loaded page routes');

    const app = express();
    const port = process.env.PORT || 3001; // Changed to 3001 to avoid conflicts

    // Middleware
    app.use(morgan('dev'));
    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

    // API Routes
    app.use(admissionsRoutes);
    app.use(authenticationRoutes);
    app.use(blogRoutes);
    app.use(campusRoutes);
    app.use(contactRoutes);
    app.use(courseRoutes);
    app.use(departmentRoutes);
    app.use(homeRoutes);
    app.use(pageRoutes);

    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'Server is running',
            timestamp: new Date()
        });
    });

    // Error Handlers
    app.use((req, res, next) => {
        res.status(404).json({
            status: 'error',
            message: 'Route not found'
        });
    });

    app.use((err, req, res, next) => {
        console.error('Error encountered:', err);
        res.status(err.status || 500).json({
            status: 'error',
            message: err.message || 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    });

    // Modified error handling to keep window open
    process.on('uncaughtException', (err) => {
        console.error('CRITICAL ERROR:', err);
        console.error('Stack trace:', err.stack);
        console.log('\nPress any key to exit...');
        require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        }).question('Press any key to exit...', () => {
            process.exit(1);
        });
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        // Keep the process running
    });

    // Start server
    const server = app.listen(port, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
        console.log(`Server listening at http://localhost:${port}`);
    });

    module.exports = server;

} catch (error) {
    console.error('STARTUP ERROR:', error);
    console.error('Stack trace:', error.stack);
    console.log('\nPress any key to exit...');
    require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    }).question('Press any key to exit...', () => {
        process.exit(1);
    });
}