const sequelize = require('../config/connection');
const seedUsers = require('./user-seeds');

const seedAll = async () => {
  await sequelize.sync({ force: true }); // Drops and recreates the database tables

  await seedUsers();
  console.log('Users seeded');




};

module.exports = seedAll;