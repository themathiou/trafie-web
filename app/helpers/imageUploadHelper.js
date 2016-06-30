'use strict';

let fs = require('fs'),
    path = require('path'),
    crypto = require('crypto'),
    sharp = require('sharp'),
    knox = require('knox'),
    moment = require('moment'),
    streamifier = require('streamifier'),
    s3 = knox.createClient({
        key: process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        bucket: process.env.S3_BUCKET_NAME,
        region: process.env.S3_BUCKET_REGION
    });

function _s3DeleteFilesInPath(path, excludePaths = []) {
    s3.list({prefix: path}, function(err, data){
        if(!err && data.Contents) {
            let filesToDelete = [];
            if(excludePaths.length) {
                data.Contents.forEach((s3Object) => {
                    if(excludePaths.indexOf(s3Object.Key) < 0) {
                        filesToDelete.push(s3Object.Key);
                    }
                });
            } else {
                filesToDelete = data.Contents.map((s3Object) => s3Object.Key);
            }
            s3.deleteMultiple(filesToDelete, function(err, res) {});
        }
    });
}

function _uploadImagePromise(image, size, s3Folder, resourceId) {
    return new Promise(function(resolve, reject) {
        let fileName = crypto.createHash('md5').update(moment().unix() + resourceId).digest('hex');

        if(size.size === 'full') {
            image.clone()
                .jpeg()
                .toBuffer(uploadToS3);
        } else {
            image.clone()
                .resize(size.pixels, size.pixels)
                .jpeg()
                .toBuffer(uploadToS3);
        }

        function uploadToS3(err, buffer, info) {
            if(err) reject();
            let s3Headers = {
                'Content-Type': 'image/' + info.format,
                'x-amz-acl': 'public-read',
                'Content-Length': info.size
            };

            let sizeSuffix = size.size === 'full' ? '' : '.' + size.size,
                s3ImagePrefix = s3Folder + '/' + fileName + sizeSuffix + '.' + info.format,
                s3ImagePath = '/' + s3ImagePrefix;

            s3.putStream(streamifier.createReadStream(buffer), s3ImagePath, s3Headers, function (err, s3response) {
                if (err || !s3response || (s3response && !s3response.req) || (s3response.req && s3response.req.res.statusCode !== 200)) reject();
                let pictureUrl = '';
                if(size.size === 'full') {
                    pictureUrl = s3response.req.url;
                }
                resolve({pictureUrl, s3ImagePrefix});
            });
        }
    })
}

function uploadImage(s3Folder, pictureFile, bodyPicturePath, resourceId, pictureOptions) {
    return new Promise(function(resolve, reject) {
        let pictureUrl = '',
            acceptedFormats = pictureOptions.acceptedTypes.map((type) => type.split('/').pop());

        if(!bodyPicturePath && typeof pictureFile === 'undefined') {
            _s3DeleteFilesInPath(path);
            resolve(pictureUrl);
        }
        else if(bodyPicturePath && typeof pictureFile === 'undefined') {
            resolve();
        }

        if (pictureFile.size <= pictureOptions.acceptedSize && pictureOptions.acceptedTypes.indexOf(pictureFile.type) >= 0) {
            let image = sharp(pictureFile.path);
            image.metadata()
                .then(function(metadata) {
                    if(metadata.width > pictureOptions.acceptedWidth || metadata.height > pictureOptions.acceptedHeight
                        || (pictureOptions.isSquare && metadata.width !== metadata.height) || acceptedFormats.indexOf(metadata.format) < 0) {
                        reject(422);
                    }

                    let imageUploadPromises = [];
                    pictureOptions.sizes.forEach((size) => {
                        imageUploadPromises.push(_uploadImagePromise(image, size, s3Folder, resourceId));
                    });

                    Promise.all(imageUploadPromises).then(function(values) {
                        let s3ImagePrefixes = values.map((value) => {
                            if(value.pictureUrl) {
                                pictureUrl = value.pictureUrl;
                            }
                            return value.s3ImagePrefix;
                        });

                        fs.unlink(pictureFile.path);
                        _s3DeleteFilesInPath(s3Folder, s3ImagePrefixes);
                        resolve(pictureUrl);
                    }, function(error) {
                        fs.unlink(pictureFile.path);
                        reject(500);
                    });
                });
        } else {
            fs.unlink(pictureFile.path);
            reject(422);
        }
    });
}

module.exports = {
    uploadImage
};