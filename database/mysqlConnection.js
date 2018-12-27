const env = require('../configs/env');
const DSNParser = require('dsn-parser');
const Sequelize = require('sequelize')

const connType = () => {
    if (process.env.NODE_ENV === 'test') {
        return new DSNParser(env.database_mysql_test).getParts();
    } else if (process.env.NODE_ENV === 'dev') {
        return new DSNParser(env.database_mysql_dev).getParts();
    } else if (process.env.NODE_ENV === 'prod') {
        return new DSNParser(env.database_mysql_prod).getParts();
    }
}


const sequelizeCreateConnection = new Sequelize(connType().database, connType().user, connType().password, {
    operatorsAliases: false,
    host: connType().host,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: console.log // value = false, or console.log
})

const initialDB = (sequelize) => {
    sequelize
        .authenticate()
        .then(function (err) {
            console.log('Connection has been established successfully.');
        }, function (err) {
            console.log('Unable to connect to the database:', err);
        });

    sequelize.sync({
            // force: true
        })
        .then(() => {
            console.log(`Database & tables created!`)
        })

    return sequelize
}

module.exports = {
    sequelizeCreateConnection,
    initialDB
};