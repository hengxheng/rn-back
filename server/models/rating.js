'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    r_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER
  }, {});
  Rating.associate = function(models) {
    // associations can be defined here
  };
  return Rating;
};