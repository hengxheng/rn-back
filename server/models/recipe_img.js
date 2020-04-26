'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe_Img = sequelize.define('Recipe_Img', {
    r_id: DataTypes.INTEGER,
    img_id: DataTypes.INTEGER
  }, {});
  Recipe_Img.associate = function(models) {
    // associations can be defined here
  };
  return Recipe_Img;
};