const env = require('./../env');
const crypto = require('crypto')

const {
    InvalidTransaction,
    InternalError
} = require('sawtooth-sdk/processor/exceptions')
const cbor = require('cbor');

const _hash = (x, len = -62) =>
    crypto.createHash('sha512').update(x).digest('hex').toLowerCase().slice(len)

module.exports = {
    meterAddress: (name) => `${env.family.prefix}${_hash(name, 64)}`,
    decodeCbor: (buffer) =>
        new Promise((resolve, reject) =>
            resolve(JSON.parse(buffer.toString()))
        ),
    toInternalError: (err) => {
        let message = (err.message) ? err.message : err
        throw new InternalError(message)
    },
    toInvalidTransaction: (err) => {
        let message = (err.message) ? err.message : err
        throw new InvalidTransaction(message)
    },
    setEntry: (context, address, stateValue) => {
        let entries = {
            [address]: Buffer.from(new String(JSON.stringify(stateValue)))
        }
        return context.setState(entries)
    }

}