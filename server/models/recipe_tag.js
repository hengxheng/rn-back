'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe_Tag = sequelize.define('Recipe_Tag', {
    r_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER
  }, {});
  Recipe_Tag.associate = function(models) {
    // associations can be defined here
  };
  return Recipe_Tag;
};