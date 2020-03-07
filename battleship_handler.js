const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const crypto = require('crypto');

const _hash = (x) =>
    crypto.createHash('sha512').update(x).digest('hex').toLowerCase()

const TP_FAMILY = 'battleship';
const TP_NAMESPACE = _hash(TP_FAMILY).substr(0, 6);
const TP_VERSION = '1.1';

class BattleShipTransactionHandler extends TransactionHandler {
    constructor() {
        super(TP_FAMILY, [TP_VERSION], [TP_NAMESPACE])
    }

    /**
     * Return promise with state change as result or throws error
     * @param {*} transaction 
     * @param {*} context 
     */
    apply(transaction, context) {
        return new Promise(async (resolve, reject) => {
            let address = TP_NAMESPACE + _hash('sampleKey').substr(0, 64)

            let previousValue = await context.getState([address]);



            let entries = {
                [address]: JSON.stringify('1')
            }
            return context.setState(entries)
            // never throw InternalError as this code will run forever and attempt to commit the changes forever too
        })
    }

}

module.exports = BattleShipTransactionHandler;