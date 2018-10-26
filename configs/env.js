require('dotenv').config()

module.exports = {
    apps_ports: process.env.APPS_PORT,
    database_prod: process.env.MONGO_URL_PROD,
    database_dev: process.env.MONGO_URL_DEV,
    database_test: process.env.MONGO_URL_TEST,
    secret_key: process.env.SECRET_KEY,
    public_key: process.env.PUBLIC_KEY,
    private_key: process.env.PRIVATE_KEY,
    private_key: process.env.PRIVATE_KEY,
    URL_HOST: process.env.URL_HOST,
    linkHostDomain: process.env.LINK_HOST_DOMAIN,
    swagger_host: process.env.SWAGGER_HOST,
    adminAccess: process.env.ADMIN_ACCESS,
}