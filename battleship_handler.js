const {
    TransactionHandler
} = require('sawtooth-sdk/processor/handler');
const {
    InvalidTransaction,
    InternalError
} = require('sawtooth-sdk/processor/exceptions')
const env = require('./env');
const { performTransaction } = require('./action');
const utils = require('./action/utils');

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

    apply(transactionProcessRequest, context) {
        return utils.decodeCbor(transactionProcessRequest.payload)
            .then((payload) => {
                console.error(payload)
                return performTransaction(transactionProcessRequest, context, payload)
                    .then(addresses => {
                        if (addresses.length === 0) {
                            throw new InternalError('State Error!')
                        }
                        console.log(`Action Received ${JSON.stringify(payload)}`)
                    })
                    .catch(utils.toInvalidTransaction);
            })
            .catch(utils.toInvalidTransaction);
    }
}

module.exports = Handler;

// module.exports = BattleShipTransactionHandler;