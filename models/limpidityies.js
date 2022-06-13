const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Limpidityies = sequelize.define('limpidityies', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    limpidityies: {
        type: Sequelize.BLOB,
        allowNull: false
      }
});



module.exports = Limpidityies;