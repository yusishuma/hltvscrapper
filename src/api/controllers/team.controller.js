/**
 * Created by tonghema on 2018/6/5.
 */
const request = require('superagent');
// const _ = require('lodash');
const sequelize = require('sequelize');
const DB = require('../../config/db').hltvDB;
const FDB = require('../../config/db').founderDB;
const TeamModel = require('../models/team.model')(DB, sequelize);
const TMHISTORIESModel = require('../models/tmhistroy.model')(DB, sequelize);
const vars = require('../../config/vars');
const qlimit = require('qlimit')(10);
const Q = require('q');
const cheerio = require('cheerio');
const moment = require('moment');
const FounderTeamModel = require('../models/founder.team.model')(FDB, sequelize);
TMHISTORIESModel.sync({force: false});

exports.teamsMatches = async () => {
  try {
    let teams = await FounderTeamModel.findAll({where: {add: 1}, limit: 1});
    let team = teams[0];
    let statusUrl = 'https://www.hltv.org/stats/teams/matches/' + team.hltvId + '/' + team.name;
    return request.get(statusUrl).then((result) => {
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
          }).then(() => {
            return TeamModel.update({isUpdateMatch: true}, {
              where: {
                hltvId: team.hltvId
              }
            });
          }).then(() => {
            return FounderTeamModel.update({add: 5}, {
              where: {
                hltvId: team.hltvId
              }
            });
          });
        }
      })
    }).then(() => {
      return team;
    })
  } catch (error) {
    console.log(error);
    return error;
  }
};
exports.teamsMapRates = async (team) => {
  try {
    let statusUrl = 'https://www.hltv.org/stats/teams/maps/' + team.hltvId + '/' + team.name;
    request.get(statusUrl).then((result) => {
      let $ = cheerio.load(result.res.text);
      let items = [];
      let itemsImgs = [];
      let itemsNames = [];
      let itemsRates = [];
      $('div.col').find('div.map-pool-map-holder').find('img.map-pool-map').map((i, e) => {
        itemsImgs.push($(e).attr('src'));
      });
      $('div.col').find('div.map-pool-map-holder').find('div.map-pool-map-name').map((i, e) => {
        itemsNames.push($(e).text());
      });
      $('div.col').find('div.stats-rows.standard-box').map((i, e) => {
        let rate = {};
        $(e).find('span').map((j, f) => {
          if (j === 1) {
            rate.wdl = $(f).text();
          }
          if (j === 3) {
            rate.wr = $(f).text();
          }
          if (j === 5) {
            rate.tr = $(f).text();
          }
          if (j === 7) {
            rate.rag = $(f).text();
          }
          if (j === 9) {
            rate.rac = $(f).text();
          }
        });
        itemsRates.push(rate);
      });
      for (let i = 0; i < itemsNames.length; i++) {
        items.push({name: itemsNames[i], avatar: itemsImgs[i], rates: itemsRates[i]});
      }
      return TeamModel.update({
        mapsRates: JSON.stringify(items),
      }, {
        where: {
          hltvId: team.hltvId
        }
      });
    })
  } catch (error) {
    console.log(error);
    return error;
  }
};
exports.teamsPlayers = async (team) => {
  try {
    let statusUrl = 'https://www.hltv.org/stats/teams/lineups/' + team.hltvId + '/' + team.name;
    request.get(statusUrl).then((result) => {
      let $ = cheerio.load(result.res.text);
      let items = [];
      $('div.lineup-container').map((i, e) => {
        $(e).find('div.grid').find('div.col.teammate').map((j, f) => {
          let item = {};
          item.id = $(f).find('img.container-width').attr('src').split('/')[6];
          item.avatar = $(f).find('img.container-width').attr('src');
          item.flag = $(f).find('img.flag').attr('src');
          item.country = $(f).find('img.flag').attr('title');
          item.name = $(f).find('div.text-ellipsis').text();
          item.date = $(e).children('div.lineup-year').text().replace('Replace context with lineup', '');
          items.push(item);
        });
      });
      return TeamModel.update({
        players: JSON.stringify(items),
      }, {
        where: {
          hltvId: team.hltvId
        }
      });
    })

  } catch (error) {
    console.log(error);
    return error;
  }
};
exports.teamsRanking = async (team) => {
  try {

    let statusUrl = 'https://www.hltv.org/team/' + team.hltvId + '/' + team.name.toLowerCase().replace(/ /g, "-");
    request.get(statusUrl).then((result) => {
      let $ = cheerio.load(result.res.text);
      let ranking = '';
      $('div.profile-team-stat').map((i, e) => {
        if (i === 0) {
          ranking = $(e).find('a').text();
        }
      });

      return TeamModel.update({
        ranking: ranking,
        country: $('div.team-country').text(),
        name: $('div.profile-team-name.text-ellipsis').text(),
      }, {
        where: {
          hltvId: team.hltvId
        }
      });
    })
  } catch (error) {
    console.log(error);
    return error;
  }
};
