const axios = require('axios').default;

const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const { createHash } = require('crypto')
const { protobuf } = require('sawtooth-sdk')

const { TP_FAMILY, TP_NAMESPACE, TP_VERSION, hash } = require('./env')

/**
 * Create signer Key
 * can be for application level or user level
 */

const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey()
const signer = new CryptoFactory(context).newSigner(privateKey);

let signature;
/**
 * Create Payload Buffer
 */
const payload = {
    Verb: 'set',
    Name: 'foo',
    Value: 42
}

const payloadBytes = Buffer.from(JSON.stringify(payload));

const address = TP_NAMESPACE + hash('sampleKeyInAddress').substr(0, 64);

console.debug(address);
/**
 * Wrap Payload Buffer into Transaction
 */
const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: TP_FAMILY,
    familyVersion: TP_VERSION,
    inputs: [address],
    outputs: [address],
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
}).finish()


/**
 * Sign the transaction with the signer key
 */
signature = signer.sign(transactionHeaderBytes)

const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: signature,
    payload: payloadBytes
})

/** 
 * Array of transactions
*/
const transactions = [transaction]

const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
}).finish()

signature = signer.sign(batchHeaderBytes)

const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: signature,
    transactions: transactions
});

const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
}).finish()


/**
 * Submit the batch list to Sawtooth Rest API
 */

axios.post(
    'http://localhost:8008/batches',
    batchListBytes,
    {
        headers: { 'Content-Type': 'application/octet-stream' }
    }
).then(response => {
    console.log(response.data);
}).catch(error => {
    console.log(error.response.data);
})