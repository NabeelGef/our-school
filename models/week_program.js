const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Weekprogram = sequelize.define('weekprogram', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },  
});



module.exports = Weekprogram;