/**
 * Created by tonghema on 2018/5/28.
 */
// "use strict";
module.exports = function (DB, DataTypes) {
  return DB.define('MATCH', {
    hltvId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
    },
    matchDetialUrl: {
      type: DataTypes.STRING,
    },
    team1Id: {
      type: DataTypes.STRING,
    },
    team1Name: {
      type: DataTypes.STRING,
    },
    team1Logo: {
      type: DataTypes.STRING,
    },
    team2Id: {
      type: DataTypes.STRING,
    },
    team2Name: {
      type: DataTypes.STRING,
    },
    team2Logo: {
      type: DataTypes.STRING,
    },
    team1Score: {
      type: DataTypes.STRING,
    },
    team2Score: {
      type: DataTypes.STRING,
    },
    bo: {
      type: DataTypes.STRING,
    },
    team1PastMatch: {
      type: DataTypes.TEXT,
    },
    team2PastMatch: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
    },
    leagueId: {
      type: DataTypes.STRING,
    },
    leagueName: {
      type: DataTypes.STRING,
    },
    leagueLogo: {
      type: DataTypes.STRING,
    },
    gameType: {
      type: DataTypes.STRING,
    },
    mapBoDes: {
      type: DataTypes.TEXT,
    },
    mapDes: {
      type: DataTypes.TEXT,
    },
    mapDetails: {
      type: DataTypes.TEXT,
    },
    matchDescription: {
      type: DataTypes.STRING,
    }
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'MATCH',
  });
};

