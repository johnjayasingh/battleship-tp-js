const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const crypto = require('crypto');

const { TP_FAMILY, TP_NAMESPACE, TP_VERSION } = require('./env')


const hash = (input) => crypto.createHash('sha512').update(input).digest('hex').toLowerCase()


class BattleShipTransactionHandler extends TransactionHandler {
    constructor() {
        super(TP_FAMILY, [TP_VERSION], [TP_NAMESPACE])
    }

    apply(transaction, context) {
        const address = TP_NAMESPACE + hash('sampleKeyInAddress').substr(0, 64);
        console.debug(address)
        return context.setState({
            [address]: Buffer.from(JSON.stringify({ sampleValueInState: 'value' }))
        }).then(addresses => {
            if (addresses.length === 0) {
                throw InvalidTransaction('Something happened')
            }
        }).catch(error => {
            throw InvalidTransaction(error.message);
        })
    }

}

module.exports = BattleShipTransactionHandler;