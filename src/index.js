// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const schedule = require('node-schedule');
const Q = require('q');
// const moment = require('moment');
const matchesDetial = require('./api/controllers/match.controller');
const league = require('./api/controllers/league.controller');
// const cheerio = require('cheerio');
// const request = require('superagent');
// const _ = require('lodash');
// request
//   .get('https://www.hltv.org/matches/2323161/nrg-vs-natus-vincere-starseries-i-league-season-5')
//   .then((result) => {
//     let $ = cheerio.load(result.res.text);
//     // $("div.half-width.standard-box").find('table.table.matches').map(function (i, e) {
//     //  $(e).find('td').map(function (j, f) {
//     //    if($(f).find('a').attr('href')){
//     //      console.log($(f).text(),$(f).find('a').attr('href').split('/')[2]);
//     //    }
//     //    console.log("------", j);
//     //
//     //  });
//     //
//     // });
//     $("div.standard-box.teamsBox").map(function (i, e) {
//
//      console.log($(e).find('div.team2-gradient').children('div').text());
//
//     });
//   })
// var str = "\n                          ORDER\n                        ";
// var a = str.replace(/[\r\n]/g, "").trim();
// console.log(a, '=================');
schedule.scheduleJob('*/5 * * * *', () => {
  Q.fcall(() => {
    matchesDetial.teams();
  }).then(() => {
    league.leagues();
  }).then(() => {
    matchesDetial.matcheMaps();
  }).then(() => {
    matchesDetial.matchesStatusGameType();
  });
});

// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));

/**
 * Exports express
 * @public
 */
module.exports = app;
