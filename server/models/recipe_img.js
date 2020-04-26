'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe_Img = sequelize.define('Recipe_Img', {
    r_id: DataTypes.INTEGER,
    img_id: DataTypes.INTEGER
  }, {});

  Recipe_Img.associate = function(models) {
    Recipe_Img.belongsTo(models.Recipe, {
      foreignKey: 'r_id',
      onDelete: 'CASCADE',
    });

    Recipe_Img.belongsTo(models.Image, {
      foreignKey: 'img_id',
      onDelete: 'CASCADE',
    });
  };
  return Recipe_Img;
};