const mongoose = require('mongoose')
const env = require('../configs/env')

mongoose.Promise = require('bluebird')

const createMongoConnection = () => {

    let dbUri=''
    if (process.env.NODE_ENV === 'test') {
        mongoose.connect(env.database_test, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
        dbUri = env.database_test
        
    } else if (process.env.NODE_ENV === 'dev') {
        mongoose.connect(env.database_dev, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
        dbUri = env.database_dev
    } else if (process.env.NODE_ENV === 'prod') {
        mongoose.connect(env.database_prod, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
        dbUri = env.database_prod
    }

    mongoose.connection.on('connected', function () {
        console.log(`Mongoose connection open to (${process.env.NODE_ENV}) :${dbUri}`)
    })

    mongoose.connection.on('error', function (err) {
        console.log("Mongoose connection has occured " + err + " error");
    });

    mongoose.connection.on('disconnected', function () {
        console.log(`Mongoose connection to (${process.env.NODE_ENV}) :${dbUri} is disconnected`);
    });

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log(`Mongoose connection to (${process.env.NODE_ENV}) :${dbUri} is disconnected due to application termination`);
            process.exit(0)
        });
    });
}

module.exports = {
    createMongoConnection
}