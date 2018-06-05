// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const schedule = require('node-schedule');
const Q = require('q');
// const moment = require('moment');
const matchesDetial = require('./api/controllers/match.controller');
const league = require('./api/controllers/league.controller');
const team = require('./api/controllers/team.controller');
// const cheerio = require('cheerio');
// const request = require('superagent');
// const _ = require('lodash');

// request
//   .get('https://www.hltv.org/stats/teams/matches/6668/FLuffy Gangsters')
//   .then((result) => {
    // let $ = cheerio.load(result.res.text);
    // $('div.team-name.text-ellipsis').find('table.table.matches').map(function (i, e) {
    //  $(e).find('td').map(function (j, f) {
    //    if($(f).find('a').attr('href')){
    //      console.log($(f).text(),$(f).find('a').attr('href').split('/')[2]);
    //    }https://www.hltv.org/stats/teams/6673/NRG
    //    console.log("------", $('div.team-name.text-ellipsis').text());
    //
    //  });
    //
    // });
    // $("tbody").find('tr').map((i, e) => {
    //
    //  // console.log($(e).find('td').text());
    //   if(i == 0){
    //     $(e).find('td').map((j, f) => {
    //       if(j == 0){
    //         console.log($(f).text());
    //       }
    //       if(j == 1){
    //         console.log($(f).text());
    //         console.log($(f).find('a').attr('href'));
    //         console.log($(f).find('img').attr('src'));
    //       }
    //
    //       if(j == 3){
    //         console.log($(f).text());
    //         console.log($(f).find('a').attr('href'));
    //         console.log($(f).find('img').attr('src'));
    //       }
    //       if(j == 4){
    //         console.log($(f).text());
    //       }
    //       if(j == 5){
    //         console.log($(f).text());
    //       }
    //       if(j == 6){
    //         console.log($(f).text());
    //       }
    //     })
    //   }
    // });
  // });


schedule.scheduleJob('*/5 * * * *', () => {
  Q.fcall(() => {
    matchesDetial.teams();
  }).then(() => {
    team.teams();
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
