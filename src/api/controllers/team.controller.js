/**
 * Created by tonghema on 2018/6/5.
 */
const request = require('superagent');
// const _ = require('lodash');
const sequelize = require('sequelize');
const DB = require('../../config/db');
const TeamModel = require('../models/team.model')(DB, sequelize);
const TMHISTORIESModel = require('../models/tmhistroy.model')(DB, sequelize);
// const Q = require('q');
const qlimit = require('qlimit')(10);
const cheerio = require('cheerio');
const moment = require('moment');

TMHISTORIESModel.sync({force: false});

exports.teamsMatches = async () => {
  try {
    let teams = await TeamModel.findAll();
    for (let index = 0; index < teams.length; index++) {
      setTimeout(() => {
        return true
      }, 15000 * index);
      let team = teams[index];
      let statusUrl = 'https://www.hltv.org/stats/teams/matches/' + team.hltvId + '/' + team.name;
      request.get(statusUrl).then((result) => {
        let $ = cheerio.load(result.res.text);
        let item = {};
        $("tbody").find('tr').map((i, e) => {
          $(e).find('td').map((j, f) => {
            if (j === 0) {
              item.date = $(f).text();
            }
            if (j === 1) {
              item.leagueName = $(f).text();
              item.leagueId = $(f).find('a').attr('href').split('=')[1];
              item.leagueLogo = $(f).find('img').attr('src');
            }
            if (j === 3) {
              item.opponentName = $(f).text();
              item.opponentId = $(f).find('a').attr('href').split('/')[3];
              item.opponentFlag = $(f).find('img').attr('src');
            }
            if (j === 4) {
              item.map = $(f).text();
            }
            if (j === 5) {
              item.result = $(f).text();
            }
            if (j === 6) {
              item.win = $(f).text();
            }
          })
        });
        return TMHISTORIESModel.count({
          where: {
            teamId: team.hltvId,
            opponentId: item.opponentId,
            date: item.date,
            map: item.map
          }
        }).then((count) => {
          if (count === 0) {
            return TMHISTORIESModel.create({
              teamId: team.hltvId,
              opponentId: item.opponentId,
              opponentName: item.opponentName,
              opponentFlag: item.opponentFlag,
              leagueId: item.leagueId,
              leagueName: item.leagueName,
              leagueLogo: item.leagueLogo,
              date: item.date,
              map: item.map,
              win: item.win,
              result: item.result
            });
          } else {
            return TMHISTORIESModel.update({
              teamId: team.hltvId,
              opponentId: item.opponentId,
              opponentName: item.opponentName,
              opponentFlag: item.opponentFlag,
              leagueId: item.leagueId,
              leagueName: item.leagueName,
              leagueLogo: item.leagueLogo,
              date: item.date,
              map: item.map,
              win: item.win,
              result: item.result
            }, {
              where: {
                teamId: team.hltvId,
                opponentId: item.opponentId,
                date: item.date,
                map: item.map
              }
            });
          }
        })
      });
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
exports.teamsMaps = async () => {
  try {
    let teams = await TeamModel.findAll();
    for (let index = 0; index < teams.length; index++) {
      setTimeout(() => {
        return true
      }, 15000 * index);
      let team = teams[index];
      let statusUrl = 'https://www.hltv.org/stats/teams/maps/' + team.hltvId + '/' + team.name;
      request.get(statusUrl).then((result) => {
        let $ = cheerio.load(result.res.text);
        let item = {};
        $("tbody").find('tr').map((i, e) => {
          $(e).find('td').map((j, f) => {
            if (j === 0) {
              item.date = $(f).text();
            }
            if (j === 1) {
              item.leagueName = $(f).text();
              item.leagueId = $(f).find('a').attr('href').split('=')[1];
              item.leagueLogo = $(f).find('img').attr('src');
            }
            if (j === 3) {
              item.opponentName = $(f).text();
              item.opponentId = $(f).find('a').attr('href').split('/')[3];
              item.opponentFlag = $(f).find('img').attr('src');
            }
            if (j === 4) {
              item.map = $(f).text();
            }
            if (j === 5) {
              item.result = $(f).text();
            }
            if (j === 6) {
              item.win = $(f).text();
            }
          })
        });
        return TMHISTORIESModel.count({
          where: {
            teamId: team.hltvId,
            opponentId: item.opponentId,
            date: item.date,
            map: item.map
          }
        }).then((count) => {
          if (count === 0) {
            return TMHISTORIESModel.create({
              teamId: team.hltvId,
              opponentId: item.opponentId,
              opponentName: item.opponentName,
              opponentFlag: item.opponentFlag,
              leagueId: item.leagueId,
              leagueName: item.leagueName,
              leagueLogo: item.leagueLogo,
              date: item.date,
              map: item.map,
              win: item.win,
              result: item.result
            });
          } else {
            return TMHISTORIESModel.update({
              teamId: team.hltvId,
              opponentId: item.opponentId,
              opponentName: item.opponentName,
              opponentFlag: item.opponentFlag,
              leagueId: item.leagueId,
              leagueName: item.leagueName,
              leagueLogo: item.leagueLogo,
              date: item.date,
              map: item.map,
              win: item.win,
              result: item.result
            }, {
              where: {
                teamId: team.hltvId,
                opponentId: item.opponentId,
                date: item.date,
                map: item.map
              }
            });
          }
        })
      });
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
