/**
 * Created by tonghema on 2018/5/28.
 */
module.exports = function (DB, DataTypes) {
  return DB.define('TEAM', {
    id: {
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
    hltvId: {
      type: DataTypes.STRING,
    }
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'TEAM',
  });
};
