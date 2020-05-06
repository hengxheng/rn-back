"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      slug: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {}
  );
  Tag.associate = function (models) {
    Tag.belongsToMany(models.Recipe, {
      through: "Recipe_Tag",
      foreignKey: "tag_id",
    });
  };
  return Tag;
};
