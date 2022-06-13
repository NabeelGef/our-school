const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Instructor = sequelize.define('instructor', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    first_name: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
      },
    last_name: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
      },      
    username: {
        type: Sequelize.STRING,
        allowNull: false
        },
    password :{
        type : Sequelize.STRING,
        allowNull: false
        },
    type:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});



module.exports = Instructor;