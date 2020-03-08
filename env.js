
const crypto = require('crypto');

const hash = (input) => crypto.createHash('sha512').update(input).digest('hex').toLowerCase()

const TP_FAMILY = 'battleship';
const TP_NAMESPACE = hash(TP_FAMILY).substr(0, 6);
const TP_VERSION = '1.1';


module.exports={
    hash,
    TP_FAMILY,
    TP_NAMESPACE,
    TP_VERSION
}