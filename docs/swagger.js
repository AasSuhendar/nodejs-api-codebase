const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const config = require('../config')

// swagger definition
var swaggerDefinition = {
    info: {
        title: 'Users-Services Swagger API',
        version: '1.0.0',
        description: 'Users-Services describe with RESTful API with Swagger',
    },
    host: config.schema.get('server.address') + ':' + config.schema.get('server.port'),
    basePath: '/',
    schemes: [
        'http', 'https'
    ],
    tags: [{
        name: 'Auth',
        description: 'Operation about authentication user'
    },
    {
        name: 'Health Check',
        description: 'Operation about for health check service'
    },
    {
        name: 'Todos',
        description: 'Operation about todo service'
    }
    ]
}

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
}

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options)

module.exports = {
    swaggerUi,
    swaggerSpec
}