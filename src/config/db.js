/**
 * Created by tonghema on 2018/5/28.
 */
const Sequelize = require('sequelize');

exports.hltvDB = new Sequelize('hltv', 'jingjibocai', 'jingbocai20171031', {
  host: '39.106.24.22', // 数据库地址
  dialect: 'mysql', // 指定连接的数据库类型
  pool: {
    max: 5, // 连接池中最大连接数量
    min: 0, // 连接池中最小连接数量
    idle: 10000, // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
  },
});
exports.founderDB = new Sequelize('founder_bet6', 'jingjibocai', 'jingbocai20171031', {
  host: '39.106.24.22', // 数据库地址
  dialect: 'mysql', // 指定连接的数据库类型
  pool: {
    max: 5, // 连接池中最大连接数量
    min: 0, // 连接池中最小连接数量
    idle: 10000, // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
  },
});
