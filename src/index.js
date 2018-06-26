// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const schedule = require('node-schedule');
const Q = require('q');
// const moment = require('moment');
// const matchesDetial = require('./api/controllers/match.controller');
// const league = require('./api/controllers/league.controller');
const team = require('./api/controllers/team.controller');
// const cheerio = require('cheerio');
// const request = require('superagent');
// const _ = require('lodash');
//
// request
//   .get('https://www.hltv.org/stats/teams/maps/6922/Corvidae')
//   .then((result) => {
//     let $ = cheerio.load(result.res.text);
//     $('div.lineup-container').map((i, e) => {
//       $(e).find('div.lineup-year').find('span').text();
//       $(e).find('div.grid').find('div.col.teammate').map((j, f) => {
//         console.log( $(f).text(), '=======data==========', j);
//         console.log( $(f).find('img.container-width').attr('src'), '=======data==========', j);
//         console.log( $(f).find('img.flag').attr('src'), '=======data==========', j);
//         console.log( $(f).find('div.text-ellipsis').text(), '=======data==========', j);
//       })
//       console.log(i, '=======data==========');
//     });
//   });
// '*/15 * * * *'

// const matchesRule = new schedule.RecurrenceRule();
// matchesRule.minute = 15;
// schedule.scheduleJob(matchesRule, () => {
//   Q.fcall(() => {
//     console.log('开始抓取teams');
//     return matchesDetial.teams();
//   }).then(() => {
//     console.log('开始抓取matches');
//     return matchesDetial.matches();
//   }).then(() => {
//     console.log('开始抓取matchesStatusGameType');
//     return matchesDetial.matchesStatusGameType();
//   });
// });
// const matcheMapsRule = new schedule.RecurrenceRule();
// matcheMapsRule.minute = 15;
// schedule.scheduleJob(matcheMapsRule, () => {
//   Q.fcall(() => {
//     console.log('开始抓取matcheMaps');
//     return matchesDetial.matcheMaps();
//   });
// });
// const teamsMatchesRule = new schedule.RecurrenceRule();
// teamsMatchesRule.minute = 16;
// schedule.scheduleJob(teamsMatchesRule, function () {
//   return Q.fcall(function () {
//     console.log('开始抓取teamsMatches');
//     return team.teamsMatches();
//   });
// });
// const teamsMapRatesRule = new schedule.RecurrenceRule();
// teamsMapRatesRule.minute = 17;
// schedule.scheduleJob(teamsMapRatesRule, function () {
//   return Q.fcall(function () {
//     console.log('开始抓取teamsMapRates');
//     return team.teamsMapRates();
//   });
// });
const teamsPlayersRule = new schedule.RecurrenceRule();
teamsPlayersRule.minute = 19;
schedule.scheduleJob(teamsPlayersRule, function () {
  return Q.fcall(function () {
    console.log('开始抓取teamsPlayers');
    return team.teamsPlayers();
  });
});
// const leaguesRule = new schedule.RecurrenceRule();
// leaguesRule.minute = 20;
// schedule.scheduleJob(leaguesRule, function () {
//   return Q.fcall(function () {
//     console.log('开始抓取leagues');
//     return league.leagues();
//   });
// });


// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));

/**
 * Exports express
 * @public
 */
module.exports = app;
