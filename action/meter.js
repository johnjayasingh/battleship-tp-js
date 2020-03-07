const utils = require('./utils');

module.exports = {
    registerMeter: async ({ context, data }) => {
        const { meterId, userId } = data;
        const meterAddress = utils.meterAddress(meterId);
        const possibleAddressValues = await context.getState([meterAddress]).catch(utils.toInvalidTransaction);
        let stateValueRep = possibleAddressValues[meterAddress]
        let stateValue
        if (stateValueRep && stateValueRep.length) {
            stateValue = JSON.parse(stateValueRep)
            if (stateValue) {
                if (stateValue.userId === data.userId) {
                    utils.toInvalidTransaction('Device Already registered with Same User');
                }
                else {
                    stateValue.userId = data.userId;
                }
            } else {
                stateValue = data;
            }
        } else {
            stateValue = data;
        }
        return utils.setEntry(context, meterAddress, stateValue).catch(console.error);
    },
    trackEnergy: async ({ context, data }) => {
        let orderData;
        orderData = await data.orderData;
        const { meterId, userId} = data;
        const meterAddress = utils.meterAddress(meterId);
        const possibleAddressValues = await context.getState([meterAddress]).catch(utils.toInvalidTransaction);
        let stateValueRep = possibleAddressValues[meterAddress]
        let stateValue
        if (stateValueRep && stateValueRep.length) {
            stateValue = JSON.parse(stateValueRep)
            if (stateValue) {
                if (!stateValue.consumption) {
                    stateValue.consumption = [];
                }
                if (!stateValue.production) {
                    stateValue.production = [];
                }
                if (data.consume) {
                    stateValue.consumption.push(data.consume);
                    stateValue.order = [];
                    stateValue.order.push(orderData);
                    console.log('Testing1:'+ orderData);

                }
                if (data.produce) {
                    stateValue.production.push(data.produce);
                    stateValue.order = [];
                    stateValue.order.push(orderData);
                    console.log('Testing2:'+ orderData);

                }
                
            } else {
                utils.toInvalidTransaction('Device Is Not Registered');
            }
        } else {
            utils.toInvalidTransaction('Device Is Not Registered');
        }
        return utils.setEntry(context, meterAddress, stateValue).catch(console.error);
    }
}