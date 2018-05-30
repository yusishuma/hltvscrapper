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
          return TeamModel.count({where: {id: team.id}}).then((count) => {
            if(count === 0){
              return TeamModel.create({
                id: team.id,
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
            }else {
              return TeamModel.update({
                id: team.id,
                name: team.name,
                newName: team.newName,
                country: team.country,
                avatarFile: team.avatarFile,
                hltvId: team.hltvId,
                cgbId: team.cgbId,
                gameType: 'cs:go',
              }, {where: {id: team.id}});
            }
          })
          })));
      });
  } catch (error) {
    return error;
  }
};
exports.matches = async () => {
  try {
    let data = {};
    return request
      .get('https://hltv.gainskins.com/api/tours/')
      .then((result) => {
        data = result;
        return Q.all(data.body.tourMatches.map(qlimit((item) => {
          const match = item;
          let pastMatch1 = [];
          let pastMatch2 = [];
          let entName = '';
          let entAvatar = '';
          if (match.details.stats) {
            match.details.stats[match.teamId1.toString()].map((str) => {
              pastMatch1.push(str);
              return pastMatch1;
            });
            match.details.stats[match.teamId2.toString()].map((str2) => {
              pastMatch2.push(str2);
              return pastMatch2;
            });
          }
          if (match.details && match.details.tournament) {
            entName = match.details.tournament.name;
            entAvatar = match.details.tournament.avatar;
          }
          return MatchModel.count({where: {tourId: match.tourId}}).then((count) => {
            if(count === 0){
              MatchModel.create({
                tourId: match.tourId,
                date: match.date,
                teamId1: match.teamId1,
                teamId2: match.teamId2,
                team1Score: match.team1Score,
                team2Score: match.team2Score,
                bo: match.details.bo || 0,
                team1Wins: match.details.team1Wins || 0,
                team2Wins: match.details.team2Wins || 0,
                tournamentName: entName,
                team1PastMatch: JSON.stringify(pastMatch1),
                team2PastMatch: JSON.stringify(pastMatch2),
                tournamentAvatar: entAvatar,
              }).catch(function (result) {
                console.log(result);
              });
            }else {
              return MatchModel.update({
                tourId: match.tourId,
                date: match.date,
                teamId1: match.teamId1,
                teamId2: match.teamId2,
                team1Score: match.team1Score,
                team2Score: match.team2Score,
                bo: match.details.bo || 0,
                team1Wins: match.details.team1Wins || 0,
                team2Wins: match.details.team2Wins || 0,
                tournamentName: entName,
                team1PastMatch: JSON.stringify(pastMatch1),
                team2PastMatch: JSON.stringify(pastMatch2),
                tournamentAvatar: entAvatar,
              }, {where: {tourId: match.tourId}});
            }
          });
        })));
      })
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
            status: item.status,
            hltvId: item.hltvId
          }, {
            where: {tourId: item.id}
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
      let urls = [];
      $("a.a-reset").map(function (i, e) {
        if ($(e).attr("href").search(/matches\//) > 0) {
          urls.push($(e).attr("href"));
        }
      });
      Q.all(urls.map(qlimit((url) => {
        request.get('https://www.hltv.org' + url).then((data) => {
          let $ = cheerio.load(data.res.text);
          let mapBoDes = $("div.padding.preformatted-text").html();
          let mapDes = '';
          let mapDetails = [];
          $("div.standard-box.veto-box").map(function (i, e) {
            if (i == 1) {
              mapDes = $(e).text();
            }
          });
          $("div.mapholder").map(function (i, e) {
            $(e).children('div').map(function (a, b) {
              let mapDetail = {};
              if (a === 0) {
                mapDetail.mapName = $(this).text();
                mapDetail.mapImage = $(b).find('.map-name-holder').find('img').attr('src');
              }
              if (a === 1) {
                mapDetail.mapScore = $(this).text();
              }
              mapDetails.push(mapDetail);
            })
          });
          return MatchModel.update({
            mapBoDes: mapBoDes,
            mapDes: mapDes,
            mapDetails: JSON.stringify(mapDetails)
          }, {
            where: {hltvId: url.split('/')[2]}
          }).then((result) => {
            console.log(result);
          })
        })
      })))
    })
};
