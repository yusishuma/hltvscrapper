/**
 * Created by tonghema on 2018/5/28.
 */
// "use strict";
module.exports = function (DB, DataTypes) {
  return DB.define('MATCH', {
    tourId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    hltvId: {
      type: DataTypes.STRING,
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
      allowNull: false,
    },
    team2Score: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team1Wins: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team2Wins: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team1PastMatch: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    team2PastMatch: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
    tournamentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tournamentAvatar: {
      type: DataTypes.STRING,
      allowNull: false,
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
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'MATCH',
  });
};

