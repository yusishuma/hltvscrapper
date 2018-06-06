/**
 * Created by tonghema on 2018/5/28.
 */
const request = require('superagent');
// const { omit } = require('lodash');
const sequelize = require('sequelize');
const DB = require('../../config/db');
const TeamModel = require('../models/team.model')(DB, sequelize);
const MatchModel = require('../models/match.model')(DB, sequelize);
const Q = require('q');
const qlimit = require('qlimit')(10);
const cheerio = require('cheerio');
const moment = require('moment');

TeamModel.sync({force: false});
MatchModel.sync({force: false});

exports.teams = async () => {
  try {
    return request
      .get('https://hltv.gainskins.com/api/tours/')
      .then((result) => {
        const data = result;
        return Q.all(data.body.playerTeams.map(qlimit((item) => {
          const team = item;
          return TeamModel.count({where: {hltvId: team.hltvId}}).then((count) => {
            if (count === 0 && team.hltvId) {
              return TeamModel.create({
                name: team.name,
                newName: team.newName,
                country: team.country,
                avatarFile: team.avatarFile,
                hltvId: team.hltvId,
                cgbId: team.cgbId,
                gameType: 'cs:go',
              }).catch(function (result) {
                console.log(result);
              });
            } else if (team.hltvId) {
              return TeamModel.update({
                name: team.name,
                newName: team.newName,
                country: team.country,
                avatarFile: team.avatarFile,
                hltvId: team.hltvId,
                cgbId: team.cgbId,
                gameType: 'cs:go',
              }, {where: {hltvId: team.hltvId}});
            }
          })
        })));
      });
  } catch (error) {
    return error;
  }
};
exports.matchesStatusGameType = async () => {
  try {
    let data = {};
    return request
      .get('https://hltv.gainskins.com/api/tours/')
      .then((result) => {
        data = result;
        return Q.all(data.body.tours.map(qlimit((item) => {
          return MatchModel.update({
            gameType: item.gameType,
            status: item.status
          }, {
            where: {hltvId: item.hltvId}
          });
        })));
      });
  } catch (error) {
    return error;
  }
};
exports.matcheMaps = async () => {
  request
    .get('https://www.hltv.org/matches')
    .then((result) => {
      let $ = cheerio.load(result.res.text);
      let urlsDatas = [];
      $("div.upcoming-matches").find('a.a-reset.block.upcoming-match.standard-box').map(function (i, e) {
        if ($(e).attr("href").search(/matches\//) > 0) {
          urlsDatas.push({url: $(e).attr("href"), bo: $(e).find('table.table').find('div.map-text').text()});
        }
      });
      $("div.live-match").find('a.a-reset').map(function (i, e) {
        urlsDatas.push({url: $(e).attr("href"), bo: $(e).find('table.table').find('td.bestof').text()});
      });
      for (let index = 0; index < urlsDatas.length; index++) {
        setTimeout(() => {
          return true
        }, 15000 * index);
        let urlsData = urlsDatas[index];
        request.get('https://www.hltv.org' + urlsData.url).then((data) => {
          let $ = cheerio.load(data.res.text);
          let mapBoDes = $("div.padding.preformatted-text").html();
          let mapDes = '';
          let mapDetails = [];
          let pastMatch1 = [];
          let pastMatch2 = [];
          let match = {};
          $("div.standard-box.veto-box").map(function (i, e) {
            if (i == 1) {
              mapDes = $(e).text();
            }
          });
          $("div.standard-box.teamsBox").map(function (i, e) {
            match.date = moment(parseInt($(e).find('.time').attr('data-unix')));
            match.leagueName = $(e).find('div.event.text-ellipsis').text();
            match.leagueId = $(e).find('div.event.text-ellipsis').find('a').attr('href').split('/')[2];
            match.teamId1 = $(e).find('div.team1-gradient').find('a').attr('href') ? $(e).find('div.team1-gradient').find('a').attr('href').split('/')[2] : '';
            match.teamId2 = $(e).find('div.team2-gradient').find('a').attr('href') ? $(e).find('div.team2-gradient').find('a').attr('href').split('/')[2] : '';
            match.teamId1Url = $(e).find('div.team1-gradient').find('a').attr('href');
            match.teamId1Url = $(e).find('div.team1-gradient').find('a').attr('href');
            match.team1Name = $(e).find('div.team1-gradient').find('div.teamName').text();
            match.team2Name = $(e).find('div.team2-gradient').find('div.teamName').text();
            match.matchDescription = $(e).find('div.text').text();
            match.team1Score = $(e).find('div.team1-gradient').children('div').text() || 0;
            match.team2Score = $(e).find('div.team2-gradient').children('div').text() || 0;
            match.bo = urlsData.bo;

          });
          $("div.mapholder").map(function (i, e) {
            $(e).children('div').map(function (a, b) {
              let mapDetail = {};
              if (a === 0) {
                mapDetail.mapName = $(this).text().replace(/[\r\n]/g, "").trim();
                mapDetail.mapImage = $(b).find('.map-name-holder').find('img').attr('src');
              }
              if (a === 1) {
                mapDetail.mapScore = $(this).text();
              }
              mapDetails.push(mapDetail);
            })
          });
          $("div.half-width.standard-box").find('table.table.matches').map(function (i, e) {
            $(e).find('td').map(function (j, f) {
              let pastMatch = {};
              if (j === 0) {
                pastMatch.bo = $(f).text();
              }
              if (j === 1) {
                pastMatch.teamName = $(f).text().replace(/[\r\n]/g, "").trim();
              }
              if ($(f).find('a').attr('href')) {
                pastMatch.teamId = $(f).find('a').attr('href').split('/')[2];
              }
              if (j === 2) {
                pastMatch.teamScore = $(f).text();
              }
              if (i === 0) {
                pastMatch1.push(pastMatch);
              }
              if (i === 1) {
                pastMatch2.push(pastMatch);
              }
            });
          });
          return MatchModel.count({where: {hltvId: urlsData.url.split('/')[2]}}).then((count) => {
            if (count === 0) {
              return MatchModel.create({
                hltvId: urlsData.url.split('/')[2],
                date: match.date.toString(),
                teamId1: match.teamId1,
                teamId2: match.teamId2,
                team1Score: match.team1Score,
                team2Score: match.team2Score,
                bo: match.bo || 0,
                leagueId: match.leagueId,
                leagueName: match.leagueName,
                team1PastMatch: JSON.stringify(pastMatch1),
                team2PastMatch: JSON.stringify(pastMatch2),
                mapBoDes: mapBoDes,
                mapDes: mapDes,
                mapDetails: JSON.stringify(mapDetails),
                matchDescription: match.matchDescription
              });
            } else {
              return MatchModel.update({
                hltvId: urlsData.url.split('/')[2],
                date: match.date.toString(),
                teamId1: match.teamId1,
                teamId2: match.teamId2,
                team1Score: match.team1Score,
                team2Score: match.team2Score,
                bo: match.bo || 0,
                leagueId: match.leagueId,
                leagueName: match.leagueName,
                team1PastMatch: JSON.stringify(pastMatch1),
                team2PastMatch: JSON.stringify(pastMatch2),
                mapBoDes: mapBoDes,
                mapDes: mapDes,
                mapDetails: JSON.stringify(mapDetails),
                matchDescription: match.matchDescription
              }, {where: {hltvId: urlsData.url.split('/')[2]}});
            }
          }).then(() => {
            let teams = [];
            if (match.teamId1Url && match.teamId1) {
              teams.push({hltvId: match.teamId1, teamUrl: match.teamId1Url, teamName: match.team1Name})
            }
            if (match.teamId2Url && match.teamId2) {
              teams.push({hltvId: match.teamId2, teamUrl: match.teamId2Url, teamName: match.team2Name})
            }
            return Q.all(teams.map((team) => {
              return TeamModel.count({where: {hltvId: team.hltvId}}).then((count) => {
                if (count === 0 && team.hltvId) {
                  return TeamModel.create({
                    name: team.teamName,
                    hltvId: team.hltvId,
                    teamUrl: team.teamUrl,
                    gameType: 'cs:go',
                  }).catch(function (result) {
                    console.log(result);
                  });
                } else if (team.hltvId) {
                  return TeamModel.update({
                    teamUrl: team.teamUrl,
                    gameType: 'cs:go',
                  }, {where: {hltvId: team.hltvId}});
                }
              })
            }))
          });
        })
      }
    })
};
