"use strict";
const faker = require("faker");
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          id: 1,
          firstName: "Heng",
          lastName: "Zou",
          email: "zou@gmail.com",
          nickname: "heng",
          password:
            "$2b$12$xIuMyjy/0a9UjkZiwGC6wuzs8pIAQkv9cp01TkF26IgVgfU.FpMby", //1234
          status: "Actived",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: "1",
          nickname: faker.name.firstName(),
          password:
            "$2b$12$xIuMyjy/0a9UjkZiwGC6wuzs8pIAQkv9cp01TkF26IgVgfU.FpMby", //1234
          status: "Actived",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
