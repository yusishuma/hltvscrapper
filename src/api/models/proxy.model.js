/**
 * Created by tonghema on 2018/5/28.
 */
// "use strict";
module.exports = function (DB, DataTypes) {
  return DB.define('proxy_ip', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
    },
    port: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.INTEGER,
    }
  }, {
    createdAt: true,
    updatedAt: false,
    tableName: 'proxy_ip',
  });
};

