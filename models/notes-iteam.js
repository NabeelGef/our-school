const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const NotesIteam = sequelize.define('notesIteam', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});
module.exports = NotesIteam;
