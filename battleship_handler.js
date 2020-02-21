const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const crypto = require('crypto');

const TP_FAMILY = 'battleship';
const TP_NAMESPACE = '010101';
const TP_VERSION = '1.0';

class BattleShipTransactionHandler extends TransactionHandler {
    constructor() {
        super(TP_FAMILY, [TP_VERSION], [TP_NAMESPACE])
    }

    apply(transaction, context) {
        return new Promise((resolve, reject) => {
            console.log(transaction)
        })
    }

}

module.exports = BattleShipTransactionHandler;