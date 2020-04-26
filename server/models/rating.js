'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    r_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER
  }, {});

  Rating.associate = function(models) {
    Rating.belongsTo(models.Recipe, {
      foreignKey: 'r_id',
      onDelete: 'CASCADE',
    });

    Rating.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };
  return Rating;
};