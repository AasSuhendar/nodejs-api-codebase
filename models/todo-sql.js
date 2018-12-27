const Sequelize = require('sequelize')
const sequelize = require('../database/mysqlConnection').sequelizeCreateConnection

const Todo = sequelize.define('Todo', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
    },
})

module.exports = Todo