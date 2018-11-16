'use strict';

const AWSDataEncryptionHelper = require('./AWSDataEncryptionHelper');

const fs = require('fs');
const async = require('async');
const program = require('commander');
const _ = require('lodash');

program
    .option('-c, --config-file <configFile>', 'AWS Configuration File')
    .option('-e, --encrypt <encrypt>', 'Whether to encrypt or not')
    .parse(process.argv);

let configFile = program.configFile || './config.local.json';
let encryptFlow = program.encrypt === 'true' || program.encrypt === 'yes' ;
let config = null;

let data_unecnrypted = [
    'Starcraft', 'LOL', 'S0M3_v4LuE!oAsL0001563', 'HelloWorld!', 'Universidad Autónoma de Nuevo León'
];
let data_encrypted = [
    'AQICAHjVKTvMEaUBZonNomxaL2C7vdMjDuZWneyc1CLA8euOAQFvTNbJp7ezPl9riBaC3GtRAAAAZzBlBgkqhkiG9w0BBwagWDBWAgEAMFEGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM9eiGCVGoQunLv1vnAgEQgCQ9B9+TDCNjfb3HVCI2hWtux4Fb6/DfXT23/CNr+24v5i8vG3Y=',
    'AQICAHjVKTvMEaUBZonNomxaL2C7vdMjDuZWneyc1CLA8euOAQEBHfIQVvXkuBf2V7Am7NE8AAAAYTBfBgkqhkiG9w0BBwagUjBQAgEAMEsGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM//OvKn/cn1U2cSAbAgEQgB70zk6kKdDGOpW1TDpPfkLcgfeOXZZbpDf/aP7VC5o=',
    'AQICAHjVKTvMEaUBZonNomxaL2C7vdMjDuZWneyc1CLA8euOAQH78eDdcUh+4bq8OcllI+nOAAAAdDByBgkqhkiG9w0BBwagZTBjAgEAMF4GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMrPt97SzbkH4sKQDJAgEQgDG2b9EZZXiLHr6Tuc7fChZt9a8i6Q0L4HhTWKE6QvJty+inJzBnng0w2rGNGWv83OJE',
    'AQICAHjVKTvMEaUBZonNomxaL2C7vdMjDuZWneyc1CLA8euOAQE6+XAqK3X/1j4G9v0X6FTQAAAAaTBnBgkqhkiG9w0BBwagWjBYAgEAMFMGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMP7CpdmIFXs7uCpkmAgEQgCYFtBkOnxpdccfi1AoK44PmjlTX9nJ00FMtjxzjb15NpeMe45oD7g==',
    'AQICAHjVKTvMEaUBZonNomxaL2C7vdMjDuZWneyc1CLA8euOAQF7YvW01b9w8mvxHw5ffWA7AAAAgzCBgAYJKoZIhvcNAQcGoHMwcQIBADBsBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDCEEKLsRysc4I9zYcwIBEIA/267kLiheZifrD4IDBdnzmXvq+e19KTgF7qNGa7hA3+p/bM/1oRcBixMMNIVXBY3UZMmJHN0bpuKLPwSnwbbz'
];

let result = [];

async.waterfall([
    function (cb) {
        try {
            console.log('Reading configuration file:', configFile);
            config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
            console.log('Configuration file successfully read:', configFile);
            cb(null);
        } catch (e) {
            cb(e, null);
        }
    },
    function (cb) {
        if (encryptFlow) {
            console.log('Running encryption process...');
            async.eachSeries(data_unecnrypted, function (value, eachCB) {
                AWSDataEncryptionHelper.encryptData(value, config, function (err, encryptedValue) {
                    if (err) {
                        console.log('Something went wrong', err);
                    } else {
                        console.log(`Unencrypted value: ${value}. Encrypted value: ${encryptedValue}`);
                        result.push(encryptedValue);
                    }
                    eachCB();
                });
            }, function () {
                console.log('Encryption process completed');
                cb();
            });
        } else {
            console.log('Running un-encryption process...');
            async.eachSeries(data_encrypted, function (value, eachCB) {
                AWSDataEncryptionHelper.unencryptData(value, config, function (err, encryptedValue) {
                    if (err) {
                        console.log('Something went wrong', err);
                    } else {
                        console.log(`Encrypted value: ${value}. Unencrypted value: ${encryptedValue}`);
                        result.push(encryptedValue);
                    }
                    eachCB();
                });
            }, function () {
                console.log('Encryption process completed');
                cb();
            });
        }

    },
], function (err) {
    if (err) {
        console.log('Process completed with errors: ', err);
    } else {
        console.log('Process completed!', result);
    }
});