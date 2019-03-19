const s3 = require('../helpers/s3')
const Response = require('../helpers/response')

const getBucketlist = async (req, res) => {
    let list = await s3.getListBucketMinio()
    res.status(200).json(list)
}

const makeBucket = async (req, res) => {
    let list = await s3.makeBucketMinio(req.body.bucketName)
    res.status(200).json(list)
}

const getDownloadObject = async (req, res) => {
    let list = await s3.getDownloadObject(req.params.bucketName,req.params.filename)
    res.status(200).json(list) 
}

const uploadObject = async (req, res) => {
    try {
        let bucketExists = await s3.getS3Connection().bucketExists(req.params.bucketName)
        
        if (bucketExists) {
            s3.getS3Connection().putObject(req.params.bucketName, req.file.originalname, req.file.buffer, (err) => {
                if (err) {
                    console.log(err)
                }
                let returnVal = {
                    filename: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                }
                Response.successResponse(res, 200, 'UPLOAD-SERVICE', 'Upload file successfull', returnVal)
            })
        } else {
            Response.failedResponse(res, 500, 'UPLOAD-SERVICE', 'Bucket not exists, please create bucket first')
        } 
    } catch (error) {
        console.log(error)
    }
}

const uploadObjectFile = async (req, res) => {
    try {
        let returnVal = {
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        }
        Response.successResponse(res, 200, 'UPLOAD-SERVICE', 'Upload file successfull', returnVal)
    } catch (error) {
        console.log(error)
    }

}


module.exports = {
    getBucketlist,
    makeBucket,
    getDownloadObject,
    uploadObject,
    uploadObjectFile
}