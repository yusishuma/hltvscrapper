/**
 * Created by tonghema on 2018/5/28.
 */
module.exports = function (DB, DataTypes) {
  return DB.define('TEAM', {
    hltvId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    newName: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    avatarFile: {
      type: DataTypes.STRING,
    },
    players: {
      type: DataTypes.TEXT,
    },
    mapsRates: {
      type: DataTypes.TEXT,
    },
    gameType: {
      type: DataTypes.STRING,
    },
    isUpdateMatch: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'TEAM',
  });
};
