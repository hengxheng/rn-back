'use strict';
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    r_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    path: DataTypes.STRING
  }, {});
  Image.associate = function(models) {
    // associations can be defined here
  };
  return Image;
};