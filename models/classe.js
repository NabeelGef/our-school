const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Classe = sequelize.define('classe', {
    name_class: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },   
});



module.exports = Classe;