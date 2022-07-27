const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Complaint = sequelize.define('complaint', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },Sid:{
          type : Sequelize.INTEGER,
          allowNull: false
      },Ins_id:{
        type : Sequelize.INTEGER,
        allowNull: false
      },
      message: {
        type: Sequelize.STRING,
        require : true,
        allowNull: false,
      },
    start_date: {
        type: Sequelize.DATEONLY
    }
});



module.exports = Complaint;