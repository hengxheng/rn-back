'use strict';
module.exports = (sequelize, DataTypes) => {
  const RecipeImage = sequelize.define('RecipeImage', {
    r_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    path: DataTypes.STRING
  }, {});
  
  RecipeImage.associate = function(models) {
    RecipeImage.belongsTo(models.Recipe, {
      foreignKey: 'r_id',
      onDelete: 'CASCADE',
    });
  };
  return RecipeImage;
};