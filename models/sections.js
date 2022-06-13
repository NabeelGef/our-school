const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Sections = sequelize.define('sections', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    name_sec: {
        type: Sequelize.STRING,
        allowNull: false,
      },   
   
    });



module.exports = Sections;