require('dotenv').config()

module.exports = {
    db_type: process.env.DB_TYPE,
    database_prod: process.env.MONGO_URL_PROD,
    database_dev: process.env.MONGO_URL_DEV,
    database_test: process.env.MONGO_URL_TEST,
    database_mysql_prod: process.env.MYSQL_URL_PROD,
    database_mysql_dev: process.env.MYSQL_URL_DEV,
    database_mysql_test: process.env.MYSQL_URL_TEST,
    secret_key: process.env.SECRET_KEY || 'SecretKey',
    URL_HOST: process.env.URL_HOST,
    linkHostDomain: process.env.LINK_HOST_DOMAIN,
    swagger_host: process.env.SWAGGER_HOST,
    adminAccess: process.env.ADMIN_ACCESS,
}