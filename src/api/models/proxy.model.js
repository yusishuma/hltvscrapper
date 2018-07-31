/**
 * Created by tonghema on 2018/5/28.
 */
// "use strict";
module.exports = function (DB, DataTypes) {
  return DB.define('proxy', {
    proxy: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    }
  }, {
    createdAt: true,
    updatedAt: false,
    tableName: 'proxy',
  });
};

