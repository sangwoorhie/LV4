'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key (기본키)
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING
      },
      nickname: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING
      },
      age: {
        allowNull: false, // NOT NULL
        type: Sequelize.INTEGER
      },
      gender: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING
      },
      profileImage: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};