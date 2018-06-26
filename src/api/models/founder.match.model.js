/**
 * Created by tonghema on 2018/6/26.
 */
module.exports = function (DB, DataTypes) {
  return DB.define('dedicate_match', {
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
    tableName: 'dedicate_match',
  });
};
