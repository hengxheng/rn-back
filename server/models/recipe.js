'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    hashCode: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {});
  Recipe.associate = function(models) {
    // associations can be defined here
  };
  return Recipe;
};