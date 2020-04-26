'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    nickname: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE,
    lastLogin:  DataTypes.DATE,
    status: DataTypes.STRING,
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};