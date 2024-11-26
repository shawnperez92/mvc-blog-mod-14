const router = require('express').Router();
const { User, Comment, Blog } = require('../../models'); 
const { Op } = require('sequelize');
const withAuth = require('../../utils/auth'); 

// Route to get a user's profile
router.get('/profile/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    const user = userData.get({ plain: true });

    res.render('userpage', {
      user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error(err); // Log the error to the console
    res.status(500).json(err);
  }
});

router.get('/update-bio/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    const user = userData.get({ plain: true });

    res.render('updateBio', {
      user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);

    const userData = await User.findOne({
      where: {
        username: {
          [Op.iLike]: req.body.username // Case-insensitive comparison
        }
      }
    });

    if (!userData) {
      console.log('User not found:', req.body.username);
      res.status(400).json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    console.log('User found:', userData.username); // Add logging

    const validPassword = await userData.checkPassword(req.body.password);

    console.log('Password comparison result:', validPassword); // Log the password comparison result

    if (!validPassword) {
      console.log('Invalid password for user:', req.body.username);
      res.status(400).json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    console.error('Error during login:', err); // Log the error to the console
    res.status(500).json({ message: 'Failed to log in', error: err.message });
  }
});

// Route to handle user registration
router.post('/register', async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    console.log('New user created:', newUser); // Add logging

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;

      res.status(200).json(newUser);
    });
  } catch (err) {
    console.error('Error during registration:', err); // Log the error to the console
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Failed to register', error: err.message });
    }
  }
});

router.post('/logout', withAuth, (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.put('/profile/:id', async (req, res) => {
  try {
    const updatedUser = await User.update(
      { bio: req.body.bio },
      { where: { id: req.params.id } }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Bio updated successfully!' });
  } catch (err) {
    console.error(err); // Log the error to the console
    res.status(500).json({ message: 'Failed to update bio', error: err.message });
  }
});

router.delete('/delete', withAuth, async (req, res) => {
  try {
    const userId = req.session.user_id;

    // Delete related comments and blogs first
    await Comment.destroy({
      where: {
        user_id: userId,
      },
    });

    await Blog.destroy({
      where: {
        user_id: userId,
      },
    });

    // Delete the user
    const userData = await User.destroy({
      where: {
        id: userId,
      },
    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }

    req.session.destroy(() => {
      res.status(204).end();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;