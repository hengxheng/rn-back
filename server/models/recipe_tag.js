"use strict";
module.exports = (sequelize, DataTypes) => {
  const Recipe_Tag = sequelize.define(
    "Recipe_Tag",
    {
      r_id: DataTypes.INTEGER,
      tag_id: DataTypes.INTEGER,
    },
    {}
  );

  Recipe_Tag.associate = function (models) {
    Recipe_Tag.belongsTo(models.Recipe, {
      foreignKey: "r_id",
      onDelete: "CASCADE",
    });

    Recipe_Tag.belongsTo(models.Tag, {
      foreignKey: "tag_id",
    });
  };
  return Recipe_Tag;
};
