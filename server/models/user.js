"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      nickname: DataTypes.STRING,
      image: DataTypes.STRING,
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpires: DataTypes.DATE,
      lastLogin: DataTypes.DATE,
      refreshToken: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {}
  );

  User.associate = function (models) {
    User.hasMany(models.Recipe, {
      foreignKey: "user_id",
      sourceKey: "id",
    });

    User.hasMany(models.Comment, {
      foreignKey: "user_id",
      sourceKey: "id",
    });

    User.hasMany(models.Message, {
      foreignKey: "receiver_id",
      sourceKey: "id",
    });
  };
  return User;
};
