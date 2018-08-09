/**
 * Created by tonghema on 2018/8/9.
 */
module.exports = function (DB, DataTypes) {
  return DB.define('dedicate_tournament', {
    hltvId: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    add: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'dedicate_tournament',
  });
};
