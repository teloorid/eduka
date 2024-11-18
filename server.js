// index.ejs.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

//Import Routes
const admissionsRoutes = require('./routes/admissions');
const authenticationRoutes = require('./routes/authentication');
const blogRoutes = require('./routes/blog');
const campusRoutes = require('./routes/campus');
const contactRoutes = require('./routes/contact');
const courseRoutes = require('./routes/courses');
const departmentRoutes = require('./routes/department');
const homeRoutes = require('./routes/home')
const pageRoutes = require('./routes/pages')

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev')); // HTTP request logger
app.use(helmet()); // Security middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define the folder to store the views (your dynamic HTML files)
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API Routes
app.use(admissionsRoutes)
app.use(authenticationRoutes)
app.use(blogRoutes)
app.use(campusRoutes)
app.use(contactRoutes)
app.use(courseRoutes)
app.use(departmentRoutes)
app.use(homeRoutes)
app.use(pageRoutes)

// Basic test route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date()
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Performing graceful shutdown...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = server; // Export for testing