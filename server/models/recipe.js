"use strict";
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    "Recipe",
    {
      hashCode: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
    },
    {}
  );

  Recipe.associate = function (models) {
    Recipe.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });

    Recipe.hasMany(models.RecipeImage, {
      foreignKey: "r_id",
      sourceKey: "id",
    });

    Recipe.belongsToMany(models.Tag, {
      through: "Recipe_Tag",
      foreignKey: "r_id",
    });
  };
  return Recipe;
};
