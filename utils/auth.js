const { User } = require('../models'); // Adjust the path as necessary

const withAuth = async (req, res, next) => {
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    try {
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
      });

      if (!userData) {
        res.redirect('/login');
        return;
      }

      req.user = userData.get({ plain: true });
      next();
    } catch (err) {
      console.error(err);
      res.redirect('/login');
    }
  }
};

module.exports = withAuth;