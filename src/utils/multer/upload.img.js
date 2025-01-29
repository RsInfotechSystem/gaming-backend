
const multer = require('multer');
const fs = require('fs');
const multerUtils = require("./multer.utils")
const uniqId = require('uniqid');

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `public/document/`;// file added to the public folder of the root directory
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path)
        }
        cb(null, path)
    },
    filename: function (req, file, cb) {
        try {
            const extension = file.mimetype.split("/")[1];// extract extension
            const filename = `${uniqId()}.${extension}`;
            cb(null, filename);
        } catch (error) {
            cb(error, null);
        }
    }
});

const uploadImg = multer({ storage: multerStorage, limits: { fileSize: multerUtils?.MULTER_UPLOAD_FILE_SIZE_LIMIT }, fileFilter: multerUtils?.multerFileTypeFilterForImage });
module.exports = { uploadImg };