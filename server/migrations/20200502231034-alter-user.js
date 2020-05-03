"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "Users",
          "image",
          {
            type: Sequelize.DataTypes.STRING,
            after: "lastName"
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "Users",
          "refreshToken",
          {
            type: Sequelize.DataTypes.STRING,
            after: "lastLogin"
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("Users", "image", { transaction: t }),
        queryInterface.removeColumn("Users", "refreshToken", { transaction: t }),
      ]);
    });
  },
};
