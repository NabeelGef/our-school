const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Classes = sequelize.define('classes', {
    name_class: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },   
});



module.exports = Classes;