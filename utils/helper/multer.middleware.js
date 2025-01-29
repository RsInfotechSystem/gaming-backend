const multer = require('multer');

//multer helper function
const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof multer.MulterError || result?.code) {
                if (result.code === 'LIMIT_FILE_COUNT') {
                    res.statusCode === 200;
                    return res.json({
                        status: "FAILED",
                        message: "Too many files selected"
                    });
                }
                if (result.code === "ONLY_IMAGE_ALLOWED") {
                    res.statusCode === 200;
                    return res.json({
                        status: "FAILED",
                        message: "Only image allowed"
                    });
                };

                if (result.code === "LIMIT_FILE_SIZE") {
                    res.statusCode === 200
                    return res.json({
                        status: "FAILED",
                        message: `${result?.field} file size exceeds the limit,Please check the ${result?.field} files`
                    })
                }

                if (result.code === "FILE_SIZE_ZERO") {
                    res.statusCode === 200;
                    return res.json({
                        status: "FAILED",
                        message: "File not selected / file size equals to zero "
                    });
                };

                return reject(result)
            }
            return resolve(result)
        });
    });
};

module.exports = runMiddleware;