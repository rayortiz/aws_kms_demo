'use strict';
const AWS = require('aws-sdk');

var AWS_init = function (config) {
    AWS.config = new AWS.Config();
    AWS.config.update(config);
};

const AWSDataEncryptionHelper = {
    unencryptData: function (data, config, cb) {
        AWS_init(getAWSParamsFromConfig(config));
        var KMS = new AWS.KMS();
        if (data) {
            var encrypted_array = new Buffer(data, 'base64');

            var params = {
                CiphertextBlob: encrypted_array
            };

            KMS.decrypt(params, function (err, data) {
                if (typeof err !== 'undefined' && err) {
                    cb(err);
                } else {
                    cb(null, data.Plaintext.toString());
                }
            });
        } else {
            cb(null, null);
        }
    },

    encryptData: function(data, config, cb) {
        AWS_init(getAWSParamsFromConfig(config));
        var KMS = new AWS.KMS();
        if (data) {
            var params = {
                KeyId: config.AWS.Key,
                Plaintext: data /* required */
            };
            KMS.encrypt(params, function (err, encrypted) {
                if (typeof err !== 'undefined' && err) {
                    cb(err);
                } else {
                    var keyvalue = new Buffer(encrypted.CiphertextBlob).toString('base64');
                    cb(null, keyvalue);
                }
            });
        } else {
            cb(null, '');
        }
    }
};

function getAWSParamsFromConfig(config) {
    return {
        accessKeyId: config.AWS.AccessKey,
        secretAccessKey: config.AWS.SecretKey,
        region: config.AWS.Region,
        KeyId: config.Key
    };
}

module.exports = AWSDataEncryptionHelper;
