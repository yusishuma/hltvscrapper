/**
 * Created by tonghema on 2018/5/30.
 */
const request = require('superagent');
// const _ = require('lodash');
const sequelize = require('sequelize');
const DB = require('../../config/db');
const LeagueModel = require('../models/league.model')(DB, sequelize);
const Q = require('q');
const qlimit = require('qlimit')(10);
const cheerio = require('cheerio');

LeagueModel.sync({force: false});

exports.leagues = async () => {
  try {
    await request
      .get('https://www.hltv.org/events#tab-ALL')
      .then((result) => {
        let $ = cheerio.load(result.res.text);
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
        for(let index = 0; index < data.length; index++) {
          setTimeout(() => {
            return true
          }, 15000 * index);
          let item = data[index];
          let hltvId = item.url.split('/')[2];
          return request
            .get('https://www.hltv.org' + item.url).then((leagueData) => {
              let $ = cheerio.load(leagueData.res.text);
              let league = {};
              let teams = [];
              $("table.info").find('td').map(function (i, e) {
                if (i === 4) {
                  league.period = $(e).text()
                }
                if (i === 5) {
                  league.prizePool = $(e).text()
                }
                if (i === 6) {
                  league.teamsSum = $(e).text()
                }
                if (i === 7) {
                  league.location = $(e).text()
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
        }
      })
  } catch (error) {
    return error;
  }
};
