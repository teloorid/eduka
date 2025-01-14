// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/blog')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// Rendering the add author form
router.get('/add-author', (req, res) => {
    res.render('add-author', { title: "Add Author" });
});

// Add new blog author
router.post('/add-author', upload.single('profile_image'), async (req, res) => {
    try {
        const {
            name,
            bio,
            social_facebook,
            social_linkedin,
            social_instagram,
            social_whatsapp,
            social_youtube
        } = req.body;

        const profileImage = req.file ? `/uploads/blog/${req.file.filename}` : null;

        // Insert into the database
        const query = `
            INSERT INTO blog_authors 
            (name, bio, profile_image, social_facebook, social_linkedin, social_instagram, social_whatsapp, social_youtube)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.promise().query(query, [
            name,
            bio,
            profileImage,
            social_facebook,
            social_linkedin,
            social_instagram,
            social_whatsapp,
            social_youtube
        ]);

        res.redirect('/posts'); // Redirect to a relevant page after successful insertion
    } catch (error) {
        console.error('Error adding author:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Rendering the add blog category form
router.get('/add-category', (req, res) => {
    res.render('add-category', { title: "Add Category" });
});

// Add new blog category
router.post('/add-category', upload.none(), async (req, res) => {
    try {
        console.log(req.body); // Check the incoming data
        const { name, post_count } = req.body;

        if (!name || post_count == null) {
            return res.status(400).send('Name and post_count are required');
        }

        await db.promise().query(`
            INSERT INTO blog_categories (name, post_count)
            VALUES (?, ?)
        `, [name, post_count]);

        res.status(201).send('Category added successfully');
    } catch (error) {
        console.error('Error inserting category:', error);
        res.status(500).send('Server error');
    }
});

// Rendering the add blog form
router.get('/add-blog', (req, res) => {
    res.render('add-blog-post', { title: "Add Blog" });
});

router.post('/add-blog-post', upload.array('images', 5), async (req, res) => {
    try {
        const {
            title,
            content,
            author_id,
            category_id,
            tags
        } = req.body;

        // Validate required fields
        if (!title || !content || !author_id || !category_id) {
            return res.status(400).send('Required fields are missing');
        }

        // Process uploaded images
        const imageUrls = req.files ? req.files.map(file => `/uploads/blog-images/${file.filename}`).join(',') : null;

        // Get current timestamp
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Clean and validate tags
        const cleanedTags = tags ? tags.trim() : null;

        // First, let's log the data we're trying to insert
        console.log('Inserting data:', {
            title,
            content,
            imageUrls,
            author_id,
            category_id,
            currentTime,
            cleanedTags
        });

        // Insert blog post with explicit NULL for tags if empty
        const [result] = await db.promise().query(`
            INSERT INTO blog_posts (
                title,
                content,
                images,
                author_id,
                category_id,
                created_at,
                updated_at,
                likes_count,
                comments_count,
                tags
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title,
            content,
            imageUrls,
            author_id,
            category_id,
            currentTime,
            currentTime,
            0, // Initial likes_count
            0, // Initial comments_count
            cleanedTags || null  // Use NULL if tags is empty
        ]);

        res.status(201).send('Blog post added successfully');
    } catch (error) {
        // Enhanced error logging
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            sqlState: error.sqlState
        });

        // Send more specific error message
        if (error.code === 'ER_INNODB_AUTOEXTEND_SIZE_OUT_OF_RANGE') {
            res.status(400).send('The data is too large for one or more fields. Please reduce the content size.');
        } else if (error.sqlMessage && error.sqlMessage.includes('CONSTRAINT')) {
            res.status(400).send('There was an issue with the data format. Please check the tags format.');
        } else {
            res.status(500).send('Server error');
        }
    }
});

// Get all blogs
router.get('/posts', (req, res) => {
    const query = 'SELECT * FROM blog_posts'; // Adjust table name based on your database schema
    db.query(query, (err, posts) => {
        if (err) {
            console.error('Database query error:', err); // Log error for debugging
            return res.status(500).send('Internal Server Error'); // Handle error gracefully
        }

        // Parse the images field if it's stored as JSON
        posts.forEach(post => {
            if (post.images) {
                post.images = JSON.parse(post.images); // Assuming images are stored as a JSON array
            }
        });

        // Pass posts to the EJS view
        res.render('blog', {
            posts,
            title: 'Blog Posts'
        });
    });
});

// Get single blog post with comments
router.get('/post/:id', async (req, res) => {
    try {
        // Get main blog post with author info
        const [post] = await db.promise().query(`
            SELECT p.*, a.name as author_name, a.profile_image as author_image, 
                   a.bio as author_bio, a.social_facebook, a.social_linkedin, 
                   a.social_instagram, a.social_whatsapp, a.social_youtube
            FROM blog_posts p
            LEFT JOIN blog_authors a ON p.author_id = a.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (!post[0]) {
            return res.status(404).send('Post not found');
        }

        // Parse the images field into an array if it's stored as JSON
        if (post[0].images) {
            post[0].images = JSON.parse(post[0].images);
        }

        // Get comments
        const [comments] = await db.promise().query(`
            SELECT * FROM blog_comments 
            WHERE post_id = ? 
            ORDER BY created_at DESC
        `, [req.params.id]);

        // Get tags
        const [tags] = await db.promise().query(`
            SELECT t.name 
            FROM blog_tags t
            JOIN blog_post_tags pt ON t.id = pt.tag_id
            WHERE pt.post_id = ?
        `, [req.params.id]);

        // Get recent posts
        const [recentPosts] = await db.promise().query(`
            SELECT id, title, image_url, created_at  
            FROM blog_posts 
            WHERE id != ? 
            ORDER BY created_at DESC 
            LIMIT 3
        `, [req.params.id]);

        // Pass data to the view
        res.render('blog-single', {
            post: post[0],
            comments,
            tags,
            recentPosts,
            title: post[0].title
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Add new comment
router.post('/comment', async (req, res) => {
    try {
        const { post_id, parent_id, author_name, author_email, content } = req.body;
        
        await db.promise().query(`
            INSERT INTO blog_comments 
            (post_id, parent_id, author_name, author_email, content)
            VALUES (?, ?, ?, ?, ?)
        `, [post_id, parent_id || null, author_name, author_email, content]);

        // Update comments count
        await db.promise().query(`
            UPDATE blog_posts 
            SET comments_count = comments_count + 1
            WHERE id = ?
        `, [post_id]);

        res.redirect(`/blog/post/${post_id}#comments`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

// Like post
router.post('/like/:id', async (req, res) => {
    try {
        await db.promise().query(`
            UPDATE blog_posts 
            SET likes_count = likes_count + 1
            WHERE id = ?
        `, [req.params.id]);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false });
    }
});

// Search posts
router.get('/search', async (req, res) => {
    try {
        const searchTerm = `%${req.query.q}%`;
        const [posts] = await db.promise().query(`
            SELECT id, title, thumbnail_image, created_at 
            FROM blog_posts 
            WHERE title LIKE ? OR content LIKE ?
            ORDER BY created_at DESC
        `, [searchTerm, searchTerm]);
        
        res.json(posts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;