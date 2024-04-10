'use strict';

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
    const generateExpiredDate = () => {
      const daysToAdd = Math.floor(Math.random() * 11);
      var date = new Date();
      date.setDate(date.getDate() + daysToAdd);
      return date;
    }

    const description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

    return queryInterface.bulkInsert("listings", [
      {
        user_id: 1,
        brand: "Toyota",
        year: 2020,
        type: "Fortuner",
        description: description,
        image_link: "https://upload.wikimedia.org/wikipedia/commons/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg",
        opening_price: 800000,
        price_increment: 50000,
        expiry_date: generateExpiredDate(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        brand: "Toyota",
        year: 2020,
        type: "Wigo",
        description: description,
        image_link: "https://upload.wikimedia.org/wikipedia/commons/7/70/Toyota_Wigo_1.0_E_2020_%28cropped%29.jpg",
        opening_price: 400000,
        price_increment: 50000,
        expiry_date: generateExpiredDate(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 3,
        brand: "Honda",
        year: 2000,
        type: "Civic",
        description: description,
        image_link: "https://upload.wikimedia.org/wikipedia/commons/9/91/96-98_Honda_Civic_LX_sedan.jpg",
        opening_price: 300000,
        price_increment: 20000,
        expiry_date: generateExpiredDate(),
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
