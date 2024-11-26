const user = require('./user');
const comment = require('./comment');
const Blog = require('./blog');

Blog.belongsTo(user, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

user.hasMany(Blog, {
    foreignKey: 'user_id',
});

Blog.hasMany(comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
});

comment.belongsTo(Blog, {
    foreignKey: 'post_id',
});

comment.belongsTo(user, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

user.hasMany(comment, {
    foreignKey: 'user_id',
});

module.exports = { Blog, user, comment };
