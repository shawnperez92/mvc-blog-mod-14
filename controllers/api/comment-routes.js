const router = require('express').Router();
const { Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      content: req.body.content,
      blog_id: req.body.blog_id,
      user_id: req.session.user_id,
      date_created: new Date(),
    });

    // Fetch the user information to include in the response
    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    res.status(200).json(commentWithUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to post comment', error: err.message });
  }
});

module.exports = router;