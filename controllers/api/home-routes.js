const router = require('express').Router();
const { Blog, Comment, User } = require('../../models'); // Ensure User model is imported
const withAuth = require('../../utils/auth'); 

// Route to render the homepage
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
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    res.render('homepage', {
      blogs,
      logged_in: req.session.logged_in,
      user: req.user, // Pass the user data to the template
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/', (req, res) => {
  res.render('main', {
      isLoggedIn: req.session.isLoggedIn,
      user_id: req.session.user_id
  });
});

// Route to render the login page
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/register', (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('registerpage'); // Ensure this matches the name of your register view
});

module.exports = router;