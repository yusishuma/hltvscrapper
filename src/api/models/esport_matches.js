/**
 * Created by tonghema on 2018/8/13.
 */
module.exports = function (DB, DataTypes) {
  return DB.define('esport_matches', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    battle_id: {
      type: DataTypes.INTEGER,
    },
    start_time: {
      type: DataTypes.INTEGER,
    },
    bo_num: {
      type: DataTypes.INTEGER,
    },
    game_id: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    league_id: {
      type: DataTypes.INTEGER,
    },
    league_name: {
      type: DataTypes.STRING,
    },
    team_a: {
      type: DataTypes.STRING,
    },
    team_b: {
      type: DataTypes.STRING,
    },
    last_moba_bo: {
      type: DataTypes.TEXT,
    }
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'esport_matches',
  });
};
