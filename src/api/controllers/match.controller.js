/**
 * Created by tonghema on 2018/5/28.
 */
const request = require('superagent');
const vars = require('../../config/vars');
const _ = require('lodash');
const sequelize = require('sequelize');
const DB = require('../../config/db').hltvDB;
const FDB = require('../../config/db').founderDB;
const TeamModel = require('../models/team.model')(DB, sequelize);
const MatchModel = require('../models/match.model')(DB, sequelize);
const LeagueModel = require('../models/league.model')(DB, sequelize);
const Q = require('q');
const qlimit = require('qlimit')(10);
const cheerio = require('cheerio');
const moment = require('moment');
const FounderMatchModel = require('../models/founder.match.model')(FDB, sequelize);

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
exports.matcheMaps = async (options, limit) => {
  let count = await FounderMatchModel.count({attributes: ['hltvId'], where: options, limit: limit});
  if (count === 0 && options.add === 1) {
    options.add = 6;
  } else if (count === 0 && options.add === 6) {
    options.add = 1;
  }
  let founderMatches = await FounderMatchModel.findAll({attributes: ['hltvId'], where: options, limit: limit});
  var matchIds = _.map(founderMatches, function (item) {
    return item.hltvId.toString();
  });
  let urlsDatas = await MatchModel.findAll({where: {hltvId: {$in: matchIds}}, limit: vars.setLimitNum});
  for (let index = 0; index < urlsDatas.length; index++) {
    setTimeout(() => {
      let urlsData = urlsDatas[index];
      request.get('https://www.hltv.org' + urlsData.matchDetialUrl).then((data) => {
        let $ = cheerio.load(data.res.text);
        let mapBoDes = $("div.padding.preformatted-text").html();
        let mapDes = '';
        let mapDetails = [];
        let pastMatch1 = [];
        let pastMatch2 = [];
        let match = {};
        $("div.standard-box.veto-box").map(function (i, e) {
          if (i === 1) {
            mapDes = $(e).text();
          }
        });
        $("div.standard-box.teamsBox").map(function (i, e) {
          match.date = moment(parseInt($(e).find('.time').attr('data-unix')));
          match.matchDescription = $(e).find('div.text').text();
          match.team1Score = $(e).find('div.team1-gradient').children('a').text() ? $(e).find('div.team1-gradient').children('div').text() : 0;
          match.team2Score = $(e).find('div.team2-gradient').children('a').text() ? $(e).find('div.team2-gradient').children('div').text() : 0;

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
              if ($(this).find('a').length > 0) {
                mapDetail.mapStatusUrl = $(this).find('a').attr('href');
              }
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
        let team1Imgs = [];
        let team1PlayerNames = [];
        let team1PlayerFlags = [];
        let team1PlayerCountries = [];
        let team1PlayerIds = [];
        let team2Imgs = [];
        let team2PlayerNames = [];
        let team2PlayerFlags = [];
        let team2PlayerCountries = [];
        let team2PlayerIds = [];
        if ($('div.players').length > 0) {
          $('div.players').map((i, e) => {
            if (i === 0) {
              $(e).find('div.text-ellipsis').map((j, f) => {
                team1PlayerNames.push($(f).text());
              });
              $(e).find('a').map((j, f) => {
                if (!$(f).attr('href')) {
                  team1PlayerIds.push('');
                } else {
                  team1PlayerIds.push($(f).attr('href').split('/')[2]);

                }
              });
              $(e).find('img.player-photo').map((j, f) => {
                team1Imgs.push($(f).attr('src'));
              });
              $(e).find('img.flag.gtSmartphone-only').map((j, f) => {
                team1PlayerFlags.push($(f).attr('src'));
                team1PlayerCountries.push($(f).attr('title'));
              })
            }
            if (i === 1) {
              $(e).find('div.text-ellipsis').map((j, f) => {
                team2PlayerNames.push($(f).text());
              });
              $(e).find('a').map((j, f) => {
                if (!$(f).attr('href')) {
                  team2PlayerIds.push('');
                } else {
                  team2PlayerIds.push($(f).attr('href').split('/')[2]);

                }
              });
              $(e).find('img.player-photo').map((j, f) => {
                team2Imgs.push($(f).attr('src'));
              });
              $(e).find('img.flag.gtSmartphone-only').map((j, f) => {
                team2PlayerFlags.push($(f).attr('src'));
                team2PlayerCountries.push($(f).attr('title'));
              })
            }
          });
        }

        match.team1Players = [];
        match.team2Players = [];
        for (let i = 0; i < team1Imgs.length; i++) {
          match.team1Players.push({
            playerId: team1PlayerIds[i],
            playerName: team1PlayerNames[i],
            playerFlag: team1PlayerFlags[i],
            playerCountry: team1PlayerCountries[i],
            playerAvatar: team1Imgs[i]
          });
          match.team2Players.push({
            playerId: team2PlayerIds[i],
            playerName: team2PlayerNames[i],
            playerFlag: team2PlayerFlags[i],
            playerCountry: team2PlayerCountries[i],
            playerAvatar: team2Imgs[i]
          })
        }
        match.videoSrc = [];
        if ($('div.stream-box-embed').length > 0) {
          $('div.stream-box-embed').map((i, e) => {
            match.videoSrc.push({
              name: $(e).find('span.flagAlign').text(),
              country: $(e).find('img.stream-flag.flag').attr('title'),
              videoUrl: $(e).attr('data-stream-embed')
            })
          });
        }
        match.result = $('div.countdown').text() || '';
        $('div.head-to-head').find('div.bold').map((i, e) => {
          if (i === 0) {
            match.headTeam1Win = $(e).text();
          }
          if (i === 1) {
            match.headTeamOvertimes = $(e).text();
          }
          if (i === 2) {
            match.headTeam2Win = $(e).text();
          }
        });
        match.headToHead = [];
        $('div.standard-box.head-to-head-listing').find('tr.row.nowrap').map((i, e) => {
          let data = {};
          $(e).find('td').map((j, f) => {
            if (j === 0) {
              data.date = $(f).find('span').attr('data-unix');
              data.matchId = $(f).find('a').attr('href').split('/')[2];
            }
            if (j === 1) {
              data.team1Id = $(f).find('a').attr('href').split('/')[2];
              data.team1Name = $(f).find('a').text();
            }
            if (j === 2) {
              data.team1Logo = $(f).find('img.logo').attr('src');
            }
            if (j === 3) {
              data.team2Id = $(f).find('a').attr('href').split('/')[2];
              data.team2Name = $(f).find('a').text();
            }
            if (j === 4) {
              data.team2Logo = $(f).find('img.logo').attr('src');
            }
            if (j === 5) {
              data.leagueId = $(f).find('a').attr('href').split('/')[2];
              data.leagueName = $(f).find('a').text();
            }
            if (j === 6) {
              data.mapName = $(f).find('div.dynamic-map-name-full').text();
            }
            if (j === 7) {
              data.result = $(f).text();
            }
          });
          match.headToHead.push(data);
        });
        let add = options.add === 1 ? 6 : 1;
        return MatchModel.update({
          hltvId: urlsData.hltvId,
          date: match.date.toString(),
          team1Players: JSON.stringify(match.team1Players),
          team2Players: JSON.stringify(match.team2Players),
          headTeam1Win: match.headTeam1Win || 0,
          headTeamOvertimes: match.headTeamOvertimes || 0,
          headTeam2Win: match.headTeam2Win || 0,
          team1Score: match.team1Score,
          team2Score: match.team2Score,
          videoSrc: JSON.stringify(match.videoSrc),
          result: match.result,
          headToHead: JSON.stringify(match.headToHead),
          team1PastMatch: JSON.stringify(pastMatch1),
          team2PastMatch: JSON.stringify(pastMatch2),
          mapBoDes: mapBoDes,
          mapDes: mapDes,
          mapDetails: JSON.stringify(mapDetails),
          matchDescription: match.matchDescription
        }, {where: {hltvId: urlsData.hltvId}}).then(() => {
          return FounderMatchModel.update({add: add}, {where: {hltvId: urlsData.hltvId}});
        });
      })
    }, vars.setTimeNum * index);
  }
};
exports.matchesMapStatus = async (options) => {
  let count = await FounderMatchModel.count({attributes: ['hltvId'], where: options});
  if (count === 0 && options.add === 1) {
    options.add = 6;
  } else if (count === 0 && options.add === 6) {
    options.add = 1;
  }
  let founderMatch = await FounderMatchModel.findOne({attributes: ['hltvId'], where: options});
  var matchIds = [founderMatch.hltvId.toString()];
  let match = await MatchModel.findOne({where: {hltvId: founderMatch.hltvId.toString()}});
  if (match.mapDetails && JSON.parse(match.mapDetails).length > 0) {
    let urlsDatas = JSON.parse(match.mapDetails);
    for (let index = 0; index < urlsDatas.length; index++) {
      setTimeout(() => {
        let urlsData = urlsDatas[index];
        if (urlsData) {
          let team1_first_half = [];
          let team2_first_half = [];
          let team1_second_half = [];
          let team2_second_half = [];
          request.get('https://www.hltv.org/stats/matches/mapstatsid/' + urlsDatas.mapStatusUrl.split('/mapstatsid/')[1]).then((result) => {
            // request.get('https://www.hltv.org/stats/matches/mapstatsid/70618/besiktas-vs-eparadise-angels').then((result) => {
            let $ = cheerio.load(result.res.text);
            $('div.round-history-team-row').map((i, e) => {
              if (i === 0) {
                $(e).find('div.round-history-half').map((j, f) => {
                  if (j === 0) {
                    $(f).find('img.round-history-outcome').map((k, g) => {
                      team1_first_half.push(translateMapStatus($(g).attr('src')));
                    })
                  }
                  if (j === 1) {
                    $(f).find('img.round-history-outcome').map((k, g) => {
                      team1_second_half.push(translateMapStatus($(g).attr('src')));
                    })
                  }
                })
              }
              if (i === 1) {
                $(e).find('div.round-history-half').map((j, f) => {
                  if (j === 0) {
                    $(f).find('img.round-history-outcome').map((k, g) => {
                      team2_first_half.push(translateMapStatus($(g).attr('src')));
                    })
                  }
                  if (j === 1) {
                    $(f).find('img.round-history-outcome').map((k, g) => {
                      team2_second_half.push(translateMapStatus($(g).attr('src')));
                    })
                  }
                })
              }
            })
          }).then(() => {
            return MatchModel.findOne({where: {hltvId: {$in: matchIds}}}).then((data) => {
              let mapDetails = JSON.parse(data.mapDetails);
              mapDetails[index].team1_first_half = team1_first_half;
              mapDetails[index].team2_first_half = team2_first_half;
              mapDetails[index].team1_second_half = team1_second_half;
              mapDetails[index].team2_second_half = team2_second_half;
              return MatchModel.update({mapDetails: JSON.stringify(mapDetails)}, {where: {hltvId: {$in: matchIds}}});
            });
          });
        }
      }, vars.setTimeNum * index);
    }
  }
};
exports.matches = async () => {
  request
    .get('https://www.hltv.org/matches')
    .then((result) => {
      let $ = cheerio.load(result.res.text);
      let urlsDatas = [];
      $("div.upcoming-matches").find('a.a-reset.block.upcoming-match.standard-box').map(function (i, e) {
        if ($(e).attr("href").search(/matches\//) > 0) {
          let match = {
            matchDetialUrl: $(e).attr("href"),
            date: moment(parseInt($(e).find('div.time').attr('data-unix'))).toString(),
            hltvId: $(e).attr("href").split('/')[2],
          };
          if ($(e).find('td.placeholder-text-cell').length > 0) {
            match.leagueName = $(e).find('td.placeholder-text-cell').text();
          } else {
            match.bo = $(e).find('table.table').find('div.map-text').text();
            match.leagueName = $(e).find('span.event-name').text();
            match.leagueLogo = $(e).find('table.table').find('img.event-logo').attr('src');
            if ($(e).find('table.table').find('img.event-logo').attr('src') !== '/img/static/event/logo/noLogo.png') {
              match.leagueId = $(e).find('table.table').find('img.event-logo').attr('src').split('/eventLogos/')[1].replace('.png', '');
            }
            $(e).find('table.table').find('div.line-align').map((j, f) => {
              if (j === 0) {
                match.team1Id = $(f).find('img.logo').attr('src').split('/logo/')[1];
                match.team1Name = $(f).text().replace(/[\r\n]/g, "").trim();
                match.team1Logo = $(f).find('img.logo').attr('src');
              }
              if (j === 1) {
                match.team2Id = $(f).find('img.logo').attr('src').split('/logo/')[1];
                match.team2Name = $(f).text().replace(/[\r\n]/g, "").trim();
                match.team2Logo = $(f).find('img.logo').attr('src')
              }
            });
          }
          urlsDatas.push(match);
        }
      });
      $("div.live-match").find('a.a-reset').map(function (i, e) {
        let match = {
          url: $(e).attr("href"),
          hltvId: $(e).attr("href").split('/')[2],
          bo: $(e).find('table.table').find('td.bestof').text()
        };
        $(e).find('img.logo').map((j, f) => {
          if (j === 0) {
            match.team1Id = $(f).attr('src').split('/logo/')[1];
            match.team1Logo = $(f).attr('src');
          }
          if (j === 1) {
            match.team2Id = $(f).attr('src').split('/logo/')[1];
            match.team2Logo = $(f).attr('src')
          }
        });
        $(e).find('span.team-name').map((j, f) => {
          if (j === 0) {
            match.team1Name = $(f).text();
          }
          if (j === 1) {
            match.team2Name = $(f).text();
          }
        });
        match.leagueName = $(e).find('div.event-name').text();
        match.leagueLogo = $(e).find('img.event-logo').attr('src');
        if ($(e).find('img.event-logo').attr('src') !== '/img/static/event/logo/noLogo.png') {
          match.leagueId = $(e).find('img.event-logo').attr('src').split('/eventLogos/')[1].replace('.png', '');
        }
        urlsDatas.push(match);
      });
      Q.all(urlsDatas.map(qlimit((match) => {
        return MatchModel.count({where: {hltvId: match.hltvId}}).then((count) => {
          if (count === 0) {
            return MatchModel.create(match);
          } else {
            return MatchModel.update(match, {where: {hltvId: match.hltvId}});
          }
        }).then(() => {
          let leagueId = match.leagueId || null;
          return LeagueModel.count({where: {hltvId: leagueId}}).then((count) => {
            if (count === 0) {
              return LeagueModel.create({
                hltvId: leagueId,
                name: match.leagueName,
                avatar: match.leagueLogo
              });
            } else {
              return null;
            }
          })
        }).then(() => {
          let teams = [];
          if (match.team1Id) {
            teams.push({hltvId: match.team1Id, avatarFile: match.teamId1Url, teamName: match.team1Name})
          }
          if (match.team2Id) {
            teams.push({hltvId: match.team2Id, avatarFile: match.teamId2Url, teamName: match.team2Name})
          }
          return Q.all(teams.map((team) => {
            return TeamModel.count({where: {hltvId: team.hltvId}}).then((count) => {
              if (count === 0 && team.hltvId) {
                return TeamModel.create({
                  name: team.teamName,
                  hltvId: team.hltvId,
                  avatarFile: team.avatarFile,
                  gameType: 'cs:go',
                }).catch(function (result) {
                  console.log(result);
                });
              } else {
                return null;
              }
            })
          }))
        });
      })));
    })
};

let translateMapStatus = (url) => {
  switch (url) {
    case '//static.hltv.org/images/scoreboard/emptyHistory.svg':
      return 0;
    case '//static.hltv.org/images/scoreboard/ct_win.svg':
      return 1;
    case '//static.hltv.org/images/scoreboard/t_win.svg':
      return 2;
    case '//static.hltv.org/images/scoreboard/bomb_exploded.svg':
      return 3;
    case '//static.hltv.org/images/scoreboard/bomb_defused.svg':
      return 4;
    case '//static.hltv.org/images/scoreboard/stopwatch.svg':
      return 5;
  }
};
