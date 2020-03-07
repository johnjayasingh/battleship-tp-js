const { registerMeter, trackEnergy } = require('./meter');
const utils = require('./utils');

module.exports = {
    performTransaction: (transactionProcessRequest, context, payload) => {
        const { Action, Data } = payload;
        switch (Action) {
            case 'registerMeter':
                return registerMeter({ context, data: Data })
            case 'trackEnergy':
                return trackEnergy({ context, data: Data })
            default:
                utils.toInvalidTransaction(`Action is not Valid ${JSON.stringify(payload)}`)
                break;
        }
    }
}