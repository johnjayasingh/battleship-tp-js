
const {
    createHash
} = require('crypto')

const leafHash = (input, length) => createHash('sha512').update(input).digest('hex').toLowerCase().slice(0, length)

const familyName = 'blocktricity'
const familyVersion = '1.0'
const familyPrefix = leafHash(familyName, 6);

const env = {
    api: {
        port: 3000,
    },
    restApiUrl: process.env.REST_API_URL || 'http://rest-api:8008',
    validatorUrl: process.env.VALIDATOR_URL || 'tcp://validator:4004',
    family: {
        name: familyName,
        prefix: familyPrefix,
        version: familyVersion
    },
    familyAddress: [familyPrefix]
}

module.exports = env