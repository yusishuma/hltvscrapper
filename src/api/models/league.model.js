/**
 * Created by tonghema on 2018/5/30.
 */
module.exports = function (DB, DataTypes) {
  return DB.define('LEAGUE', {
    hltvId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    period: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    prizePool: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    teamsSum: {
      type: DataTypes.STRING,
    }
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'LEAGUE',
  });
};
