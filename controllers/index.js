const router = require('express').Router();

const homeRoutes = require('./api/home-routes');
const userRoutes = require('./api/user-routes');
const blogRoutes = require('./api/blog-routes');
const commentRoutes = require('./api/comment-routes');

router.use('/', homeRoutes);
router.use('/api/users', userRoutes); // Ensure this path is correct
router.use('/api/blogs', blogRoutes);
router.use('/api/comments', commentRoutes);

module.exports = router;