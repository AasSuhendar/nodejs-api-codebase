const AWS = require('aws-sdk')
const Minio = require('minio')

const s3CreateConnection = () => {
    let s3 = new AWS.S3({
        accessKeyId: '7ZYICBPUU9NJLFZUPONV',
        secretAccessKey: 'jOr8O6vwJsE6p+EqJNu4nDVn+lHDTlCWF7YbOjLu',
        endpoint: 'http://127.0.0.1:9000',
        s3ForcePathStyle: true, // needed with minio?
        signatureVersion: 'v4'
    })
    return s3
}

const s3CreateConnectionMinio = () => {
    var minioClient = new Minio.Client({
        endPoint: '127.0.0.1',
        port: 9000,
        useSSL: false,
        accessKey: '7ZYICBPUU9NJLFZUPONV',
        secretKey: 'jOr8O6vwJsE6p+EqJNu4nDVn+lHDTlCWF7YbOjLu'
    })
    return minioClient
}

const getListBucketAWS =  async () =>{
    let a = s3CreateConnection().listBuckets(function (err, data) {
        if (err) {
            console.log(err)
        }
        console.log(data)
    })
    return a
    
}

const getListBucketMinio = async () => {
    try {
        let list = s3CreateConnectionMinio().listBuckets()
        return list    
    } catch (error) {
        console.log(error)
    }
}

const makeBucketMinio = async (bucketName) => {
    try {
        let list = s3CreateConnectionMinio().makeBucket(bucketName, 'us-east-1')
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
    var stream = s3CreateConnectionMinio().listObjects(bucketName, '', true)
    var obj = await stream.on('data', function (obj) { console.log(obj) })
    return obj
    // stream.on('error', function (err) { console.log(err) })
}

const getDownloadObject = async (bucketName, fileName) => {
    var data = await s3CreateConnectionMinio().getObject(bucketName, fileName, (err, stream)=> {
        if (err) {
            console.log(err)
        }
        console.log(stream)
    })
    return data
}

module.exports = {
    s3CreateConnection,
    s3CreateConnectionMinio,
    getListBucketAWS,
    getListBucketMinio,
    makeBucketMinio,
    listObject,
    getDownloadObject
}
