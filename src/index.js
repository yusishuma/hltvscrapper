// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const {port, env} = require('./config/vars');
const app = require('./config/express');
// const schedule = require('node-schedule');
// const Q = require('q');
// const moment = require('moment');
// const matchesDetial = require('./api/controllers/match.controller');
// const league = require('./api/controllers/league.controller');
// const team = require('./api/controllers/team.controller');
// const vars = require('./config/vars');

// schedule.scheduleJob('*/3 * * * *', () => {
//   Q.fcall(() => {
//     console.log('开始抓取matches');
//     return matchesDetial.matches();
//   }).then(() => {
//     console.log('开始抓取matcheMaps');
//     return matchesDetial.matcheMaps({
//       add: 1,
//       date: {'$gt': (moment().valueOf() - 0.5*3600000)/1000, '$lt': (moment().valueOf() + 3600000)/1000},
//       result: {'$ne': 'Match over'},
//     }, 5);
//   }).then(() => {
//     console.log('开始抓取matcheMaps');
//     setTimeout(() => {
//       return matchesDetial.matcheMaps({
//         add: 1,
//         date: {'$gt': (moment().valueOf() + 3600000)/1000},
//         result: {'$ne': 'Match over'},
//       }, 5);
//     }, vars.setTimeNum * 8);
//   });
// });
/**
 * =======================================================================================
 * @type {RecurrenceRule}
 */

// schedule.scheduleJob('*/1 * * * *', function () {
//   return Q.fcall(function () {
//     console.log('开始抓取teamsMatches');
//     return team.teamsMatches()
//       .then((data) => {
//         return Q.fcall(function () {
//           setTimeout(() => {
//             return Q.fcall(function () {
//               console.log('开始抓取teamsMapRates');
//               return team.teamsMapRates(data);
//             });
//           }, 1000 * 5);
//         }).then(() => {
//           setTimeout(() => {
//             return Q.fcall(function () {
//               console.log('开始抓取teamsPlayers');
//               return team.teamsPlayers(data);
//             });
//           }, 1000 * 10);
//         }).then(() => {
//           setTimeout(() => {
//             return Q.fcall(function () {
//               console.log('开始抓取teamsRanking');
//               return team.teamsRanking(data);
//             });
//           }, 1000 * 15);
//         }).then(() => {
//           setTimeout(() => {
//             return Q.fcall(function () {
//               console.log('开始抓取getLeagueDetail');
//               return league.getLeagueDetail();
//             });
//           }, 1000 * 20);
//         });
//       });
//   });
// });
//
// schedule.scheduleJob('0 0 6,18 * * ?', function () {
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
