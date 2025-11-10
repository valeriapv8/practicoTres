const sha1 = require('sha1');

exports.generateFileName = (extension) => {
    const crypto = require("crypto");
    return crypto.randomUUID() + "." + extension;
}

exports.generateAuthToken = (salt) => {
    return sha1(salt + new Date().getTime());
}
