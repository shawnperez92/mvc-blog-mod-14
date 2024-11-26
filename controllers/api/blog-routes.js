const router = require('express').Router();
const User = require('../../models/user');
const Blog = require('../../models/blog');
const Comment = require('../../models/comment');
const withAuth = require('../../utils/auth');
const commentRoutes = require('./comment-routes');

router.get('/', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      limit: 10,
      order: [['date_created', 'DESC']],
      include: [
        {
          model: Comment,
          attributes: ['id', 'content', 'date_created'],
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    res.render('blogpage', {
      blogs,
      logged_in: req.session.logged_in,
      user: req.user, // Pass the user data to the template
      username: req.user.username, // Pass the username to the template
      user_id: req.user.id, // Pass the user_id to the template
    });
  } catch (err) {
    console.error(err); // Log the error to the console
    res.status(500).json(err);
  }
});

router.get('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog found with this id' });
      return;
    }

    const blog = blogData.get({ plain: true });

    res.render('single-blogpage', {
      ...blog,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/blogs', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      order: [['date_created', 'DESC']],
      include: [
        {
          model: Comment,
          attributes: ['id', 'content', 'date_created'],
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    res.render('blogpage', {
      blogs,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    console.error(err); // Log the error to the console
    res.status(500).json(err);
  }
});

router.use('/:blogId/comments', commentRoutes);



router.post('/', withAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      username: req.body.username,
      user_id: req.body.user_id, // Include the user_id
      date_created: new Date(),
    });

    res.status(200).json(newBlog);
  } catch (err) {
    console.error(err); // Log the error to the console
    res.status(400).json({ message: 'Failed to create blog post', error: err.message });
  }
});

router.post('/:id/comments', withAuth, async (req, res) => {
  try {
    if (!req.body.content) {
      res.status(400).json({ message: 'Comment content cannot be empty' });
      return;
    }

    // Fetch the username from the User model based on the user_id stored in the session
    const user = await User.findByPk(req.session.user_id, {
      attributes: ['username'],
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const newComment = await Comment.create({
      content: req.body.content,
      blog_id: req.params.id,
      user_id: req.session.user_id,
    });

    res.status(200).json({
      ...newComment.get({ plain: true }),
      username: user.username,
    });
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json(err);
  }
});

router.use('/:blogId/comments', commentRoutes);

module.exports = router;