const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// swagger definition
var swaggerDefinition = {
    info: {
        title: 'Users-Services Swagger API',
        version: '1.0.0',
        description: 'Users-Services describe with RESTful API with Swagger',
    },
    host: 'localhost:3000',
    basePath: '/',
};

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec
}