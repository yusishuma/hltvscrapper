/**
 * Created by tonghema on 2018/6/5.
 */
module.exports = function (DB, DataTypes) {
  return DB.define('TMHISTORIES', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    teamId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leagueId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leagueName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leagueLogo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
    },
    opponentId: {
      type: DataTypes.STRING,
    },
    opponentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    opponentFlag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    map: {
      type: DataTypes.STRING,
    },
    result: {
      type: DataTypes.STRING,
    },
    win: {
      type: DataTypes.STRING,
    }
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'TMHISTORIES',
  });
};
