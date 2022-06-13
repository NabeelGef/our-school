const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Notes = sequelize.define('notes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    type: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    exp_date: {
        type: Sequelize.DATE,
        allowNull: false
    }

});



module.exports = Notes;