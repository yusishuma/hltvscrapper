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
      allowNull: false,
    },
    teamId1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teamId2: {
      type: DataTypes.STRING,
      allowNull: false,
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
      allowNull: false,
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
    matchDescription:{
      type: DataTypes.STRING,
    }
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'MATCH',
  });
};

