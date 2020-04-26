"use strict";
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      user_id: DataTypes.INTEGER,
      r_id: DataTypes.INTEGER,
      content: DataTypes.STRING,
    },
    {}
  );

  Comment.associate = function (models) {
    Comment.belongsTo(models.Recipe, {
      foreignKey: "r_id",
      onDelete: "CASCADE",
    });

    Comment.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
  };
  return Comment;
};
