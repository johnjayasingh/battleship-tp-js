const {
    InvalidTransaction,
} = require('sawtooth-sdk/processor/exceptions')

module.exports = {
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