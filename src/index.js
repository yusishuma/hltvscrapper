// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
// const matchesDetial = require('./api/controllers/match.controller');
// const league = require('./api/controllers/league.controller');
// matchesDetial.teams()
// matchesDetial.matches()
// matchesDetial.matchesStatusGameType()
// matchesDetial.matcheMaps()
// league.leagues();
// const cheerio = require('cheerio');
// const request = require('superagent');
// const _ = require('lodash');
// request
//   .get('https://www.hltv.org/events#tab-ALL')
//   .then((result) => {
//     let $ = cheerio.load(result.res.text);
//     $("div.events-month").find('a.a-reset.small-event.standard-box').map(function (i, e) {
//     });
//   })


// listen to requests
app.listen(port, () => console.info(`server started on port ${port} (${env})`));

/**
 * Exports express
 * @public
 */
module.exports = app;
