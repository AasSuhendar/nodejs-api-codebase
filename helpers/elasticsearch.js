const elasticsearch = require('elasticsearch')
const config = require('../config')
const client = new elasticsearch.Client({
    host: config.schema.get('elastic.elastic_url'),
    // log: 'trace'
})

client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('Elasticsearch cluster is down!')
    } else {
        console.log('Elasticsearch. All is well')
    }
})

const checkIndexExist = async (indexName) => {
    try {
        let response = await client.indices.exists({ index: indexName })
        return response
    } catch (err) {
        console.log(err)
    }
}

const createIndex =  async (indexName) => {
    try {
        let response = await client.indices.create({ index: indexName})
        console.log(response)
        return response
    } catch (err) {
        console.log(err)
    }
}

const addDocument = async ({indexName, docType, id = null, payload}) => {
    let data
    if (id == null) {
        data = {
            index: indexName,
            type: docType,
            body: payload
        }
    } else {
        data = {
            id:id,
            index: indexName,
            type: docType,
            body: payload
        }
    }
    
    try {
        let response = await client.index(data)
        return response
    } catch (err) {
        console.log(err)
    }
}

const getDatabyParam = async (params) => {
    try {
        let response = await client.search({q:params})
        return response
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getDatabyParam,
    checkIndexExist,
    createIndex,
    addDocument
}