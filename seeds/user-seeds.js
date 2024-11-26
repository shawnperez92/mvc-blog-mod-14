const { User } = require('../models');
const bcrypt = require('bcrypt');

const userData = [
  {
    username: 'admin',
    password: bcrypt.hashSync('password', 10),
    bio: 'admin user',
  },
  {
    username: 'admin_2',
    password: bcrypt.hashSync('password', 10),
    bio: 'second admin',
  },
];

const seedUsers = async () => {
  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
};

module.exports = seedUsers;