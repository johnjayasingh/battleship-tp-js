const {
    TransactionHandler
} = require('sawtooth-sdk/processor/handler');
const {
    InvalidTransaction,
} = require('sawtooth-sdk/processor/exceptions')

const {
    createHash
} = require('crypto')

const _hash = (input, length) => createHash('sha512').update(input).digest('hex').toLowerCase().slice(0, length)

const TP_FAMILY = 'battleship';
const TP_NAMESPACE = _hash(TP_FAMILY, 6);
const TP_VERSION = '1.1';

class Handler extends TransactionHandler {
    constructor() {
        super(TP_FAMILY, [TP_VERSION], [TP_NAMESPACE])
    }

    apply(transaction, context) {
        const address = `${TP_NAMESPACE}${_hash('sampleKey', 64)}`;

        let entries = {
            [address]: Buffer.from(new String(JSON.stringify('somevalue')))
        }
        return context.setState(entries)
            .catch(error => {
                let message = (error.message) ? error.message : error
                throw new InvalidTransaction(message)
            });
    }
}

module.exports = Handler;

// module.exports = BattleShipTransactionHandler;