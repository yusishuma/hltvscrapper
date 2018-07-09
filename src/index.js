// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const schedule = require('node-schedule');
const Q = require('q');
// const moment = require('moment');
// const matchesDetial = require('./api/controllers/match.controller');
const league = require('./api/controllers/league.controller');
const team = require('./api/controllers/team.controller');

// schedule.scheduleJob('*/3 * * * *', () => {
//   Q.fcall(() => {
//     console.log('开始抓取teams');
//     return matchesDetial.teams();
//   }).then(() => {
//     console.log('开始抓取matches');
//     return matchesDetial.matches();
//   }).then(() => {
//     console.log('开始抓取matchesStatusGameType');
//     return matchesDetial.matchesStatusGameType();
//   }).then(() => {
//     console.log('开始抓取matcheMaps');
//     return matchesDetial.matcheMaps({
//       add: 1,
//       date: {'$lt': moment().valueOf() + 3600000},
//       status: {'$ne': 'completed'}
//     }, 29);
//   }).then(() => {
//     console.log('开始抓取matcheMaps');
//     return matchesDetial.matcheMaps({
//       add: 1,
//       date: {'$gt': moment().valueOf() + 3600000},
//       status: {'$ne': 'completed'}
//     }, 1);
//   });
// });
/**
 * =======================================================================================
 * @type {RecurrenceRule}
 */

schedule.scheduleJob('0 * 7,8,9,10,11,12,13,14,15,16,17,19,20,21,22,23,0,1,2,3,4,5, * * ?', function () {
  return Q.fcall(function () {
    console.log('开始抓取teamsMatches');
    return team.teamsMatches()
      .then((data) => {
        return Q.fcall(function () {
          setTimeout(() => {
            return Q.fcall(function () {
              console.log('开始抓取teamsMapRates');
              return team.teamsMapRates(data);
            });
          }, 1000 * 5);
        }).then(() => {
          setTimeout(() => {
            return Q.fcall(function () {
              console.log('开始抓取teamsPlayers');
              return team.teamsPlayers(data);
            });
          }, 1000 * 10);
        }).then(() => {
          setTimeout(() => {
            return Q.fcall(function () {
              console.log('开始抓取teamsRanking');
              return team.teamsRanking(data);
            });
          }, 1000 * 15);
        });
      });
  });
});

schedule.scheduleJob('0 0 6,18 * * ?', function () {
  return Q.fcall(function () {
    console.log('开始抓取leagues');
    return league.leagues();
  });
});

// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));

/**
 * Exports express
 * @public
 */
module.exports = app;
