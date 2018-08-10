/**
 * Created by tonghema on 2018/5/30.
 */
const request = require('request');
// const _ = require('lodash');
const sequelize = require('sequelize');
const DB = require('../../config/db').hltvDB;
const FDB = require('../../config/db').founderDB;
const LeagueModel = require('../models/league.model')(DB, sequelize);
const FounderLeagueModel = require('../models/founder.tournament.model')(FDB, sequelize);
const vars = require('../../config/vars');
const qlimit = require('qlimit')(10);
const cheerio = require('cheerio');
const HttpsProxyAgent = require('https-proxy-agent');
const ProxyModel = require('../models/proxy.model')(DB, sequelize);
const options_proxy = {where: {type: 2}};

LeagueModel.sync({force: false});
exports.getLeagueDetail = async () => {
  try {
    let founderLeague = await FounderLeagueModel.findOne({where: {add: 1}});
    if(!founderLeague){
      await FounderLeagueModel.update({add: 1}, {where: {add: 6}});
    }
    await FounderLeagueModel.update({add: 6}, {where: {hltvId: founderLeague.hltvId}});
    let proxy = await ProxyModel.findOne(options_proxy);
    let agent = new HttpsProxyAgent('http://' + proxy.ip + ':' + proxy.port);
    await request
      .get({
        url: 'https://www.hltv.org/events/' + founderLeague.hltvId + '/' + founderLeague.name.toLowerCase().replace('#', "").replace(/ /g, "-"),
        agent: agent
      }, (err, res, leagueData) => {
        let $ = cheerio.load(leagueData);
        let league = {};
        let teams = [];
        $("table.info").find('td').map(function (i, e) {
          if (i === 0) {
            league.period = $(e).text()
          }
          if (i === 1) {
            league.prizePool = $(e).text()
          }
          if (i === 2) {
            league.teamsSum = $(e).text()
          }
          if (i === 3) {
            league.location = $(e).text().replace(/[\r\n]/g, "").trim()
          }
        });
        $("div.col").map(function (i, e) {
          if ($(e).find('div.team-name').text() !== '') {
            teams.push({name: $(e).find('div.team-name').text(), avatar: $(e).find('img.logo').attr('src')});
          }
        });
        return LeagueModel.update({
          period: league.period,
          prizePool: league.prizePool,
          teamsSum: league.teamsSum,
          location: league.location,
          teams: JSON.stringify(teams),
        }, {where: {hltvId: founderLeague.hltvId}});
      })
  } catch (error) {
    return error;
  }
};
exports.leagues = async () => {
  try {
    let proxy = await ProxyModel.findOne(options_proxy);
    let agent = new HttpsProxyAgent('http://' + proxy.ip + ':' + proxy.port);
    await request
      .get({url: 'https://www.hltv.org/events#tab-ALL', agent: agent}, (err, res, result) => {
        let $ = cheerio.load(result);
        let data = [];
        $("a.a-reset.ongoing-event").map(function (i, e) {
          let itemData = {url: $(e).attr('href')};
          $(e).children('div').map(function (a, b) {
            itemData.avatar = $(b).find('img').attr('src');
            itemData.name = $(b).find('.text-ellipsis').text();
            itemData.status = 'Ongoing events';
          });
          data.push(itemData);
        });
        $("div.events-month").find('a.a-reset.standard-box.big-event').map(function (i, e) {
          data.push({
            url: $(e).attr('href'),
            avatar: $(e).find('img.event-header').attr('src'),
            name: $(e).find('div.big-event-name').text(),
            status: 'Upcoming events'
          });
        });
        $("div.events-month").find('a.a-reset.small-event.standard-box').map(function (i, e) {
          data.push({
            url: $(e).attr('href'),
            avatar: $(e).find('img.event-header').attr('src'),
            name: $(e).find('div.big-event-name').text(),
            status: 'Upcoming events'
          });
        });
        $("div.events-month").find('a.a-reset.small-event.standard-box').map(function (i, e) {
          data.push({
            url: $(e).attr('href'),
            avatar: $(e).find('img.logo').attr('src'),
            name: $(e).find('img.logo').attr('title'),
            status: 'Upcoming events'
          });
        });
        let limit = vars.setLimitNum || data.length;
        for (let index = 0; index < limit; index++) {
          setTimeout(() => {
            let item = data[index];
            let hltvId = item.url.split('/')[2];
            return request
              .get({url: 'https://www.hltv.org' + item.url, agent: agent}, (err, res, leagueData) => {
                let $ = cheerio.load(leagueData);
                let league = {};
                let teams = [];
                $("table.info").find('td').map(function (i, e) {
                  if (i === 0) {
                    league.period = $(e).text()
                  }
                  if (i === 1) {
                    league.prizePool = $(e).text()
                  }
                  if (i === 2) {
                    league.teamsSum = $(e).text()
                  }
                  if (i === 3) {
                    league.location = $(e).text().replace(/[\r\n]/g, "").trim()
                  }
                });
                $("div.col").map(function (i, e) {
                  if ($(e).find('div.team-name').text() !== '') {
                    teams.push({name: $(e).find('div.team-name').text(), avatar: $(e).find('img.logo').attr('src')});
                  }
                });
                return LeagueModel.count({where: {hltvId: hltvId}}).then((count) => {
                  if (count === 0) {
                    LeagueModel.create({
                      hltvId: hltvId,
                      name: item.name,
                      status: item.status,
                      period: league.period,
                      prizePool: league.prizePool,
                      teamsSum: league.teamsSum,
                      location: league.location,
                      teams: JSON.stringify(teams),
                      avatar: item.avatar
                    }).catch(function (result) {
                      console.log(result);
                    });
                  } else {
                    return LeagueModel.update({
                      hltvId: hltvId,
                      name: item.name,
                      status: item.status,
                      period: league.period,
                      prizePool: league.prizePool,
                      teamsSum: league.teamsSum,
                      location: league.location,
                      teams: JSON.stringify(teams),
                      avatar: item.avatar
                    }, {where: {hltvId: hltvId}});
                  }
                })
              });
          }, vars.setTimeNum * index);

        }
      })
  } catch (error) {
    return error;
  }
};
