'use strict';

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const salt = await bcrypt.genSalt(10);

    return queryInterface.bulkInsert("users", [
      {
        name: "John Doe",
        email: "johndoe@example.com",
        password: await bcrypt.hash("admin123", salt), // , // password
        phone_number: "0239239249239",
        status: 1,
        role_id: 1, // admin role id
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Gary Ochoa",
        email: "garyocha@example.com",
        password: await bcrypt.hash("admin123", salt), // , // password
        phone_number: "0239239249239",
        status: 1,
        role_id: 2, // admin role id
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Christian Hull",
        email: "christianhull@example.com",
        password: await bcrypt.hash("admin123", salt), // , // password
        phone_number: "0239239249239",
        status: 1,
        role_id: 2, // admin role id
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
