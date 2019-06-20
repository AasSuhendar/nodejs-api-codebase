const Minio = require('minio')
const config = require('../config')

const getS3Connection = () => {
    let s3connection
    switch (config.schema.get('store.driver')) {
    case 'minio':
        s3connection = new Minio.Client({
            endPoint: config.schema.get('store.endPoint'),
            port: config.schema.get('store.port'),
            useSSL: config.schema.get('store.useSSL'),
            accessKey: config.schema.get('store.accessKey'),
            secretKey: config.schema.get('store.secretKey')
        })
        break
    case 'aws':
        break
    default:
        break
    }
    return s3connection
}

const getListBucketMinio = async () => {
    try {
        let list = getS3Connection().listBuckets()
        return list    
    } catch (error) {
        console.log(error)
    }
}

const makeBucketMinio = async (bucketName) => {
    try {
        let list = getS3Connection().makeBucket(bucketName, 'us-east-1')
        if (list) {
            console.log('Bucket created successfully in "us-east-1".')
            return list
        }
    } catch (error) {
        console.log('Error creating bucket')
        console.log(error)
    }
}

const listObject = async (bucketName) => {
    var stream = getS3Connection().listObjects(bucketName, '', true)
    var obj = await stream.on('data', function (obj) { return console.log(obj) })
    
    return obj
}

const getDownloadObject = async (bucketName, fileName) => {
    var data = await getS3Connection().getObject(bucketName, fileName, (err, stream)=> {
        if (err) {
            console.log(err)
        }
        console.log(stream)
    })
    return data
}

module.exports = {
    getListBucketMinio,
    makeBucketMinio,
    listObject,
    getDownloadObject,
    getS3Connection
}
