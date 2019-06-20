const elastic = require('../helpers/elasticsearch')

const getDatabyParam = async (req,res) => {
    let data = await elastic.getDatabyParam(req.params.param)
    res.send(data)
}

const postCreateIndex =  async (req, res) => {
    let data = await elastic.createIndex(req.body.indexname)
    res.send(data)
}

const addDocument = async (req, res) => {
    let params = {
        indexName : req.params.indexname,
        docType: req.params.type,
        id:req.params.id,
        payload: req.body,
    }
    let data = await elastic.addDocument(params)
    res.send(data)
}
module.exports  = {
    getDatabyParam,
    postCreateIndex,
    addDocument
}