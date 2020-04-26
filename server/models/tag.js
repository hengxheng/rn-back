'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    slug: DataTypes.STRING,
    name: DataTypes.INTEGER
  }, {});
  Tag.associate = function(models) {
    // associations can be defined here
  };
  return Tag;
};