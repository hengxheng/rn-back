'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    author_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {});

  Message.associate = function(models) {
    Message.belongsTo(models.User, {
      foreignKey: 'author_id',
      onDelete: 'CASCADE',
    });

    // Message.belongsTo(models.User, {
    //   foreignKey: 'receiver_id',
    //   onDelete: 'CASCADE',
    // });
  };
  return Message;
};