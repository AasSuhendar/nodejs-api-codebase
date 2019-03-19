const Multer = require('multer')

const storage = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploaded/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' +file.originalname)
    }
})

var uploadToDir = Multer({ storage: storage })
var uploadToS3 = Multer({ storage: Multer.memoryStorage() })

module.exports = {
    uploadToDir,
    uploadToS3
}