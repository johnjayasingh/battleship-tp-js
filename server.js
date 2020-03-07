const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Need to be modulirized later 
 * Sigining and forwarding transaction
 */

const API_URL = 'http://localhost:8008'


const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const { createHash } = require('crypto')
const crypto = require('crypto')
const { protobuf } = require('sawtooth-sdk')
const axios = require('axios').default;

const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey()
const signer = new CryptoFactory(context).newSigner(privateKey)


const _hash = (x) =>
    crypto.createHash('sha512').update(x).digest('hex').toLowerCase()


const TP_FAMILY = 'battleship';
const TP_NAMESPACE = _hash(TP_FAMILY).substr(0, 6);
const TP_VERSION = '1.1';

app.get('/test', async (req, res) => {

    let address = TP_NAMESPACE + _hash('sampleKey').substr(0, 64)

    const payload = {
        Name: 'Does not matter as we have not implemented any check'
    }

    // Input for one transaction
    const payloadBytes = Buffer.from(JSON.stringify(payload))

    // Output we created with this transaction input

    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: TP_FAMILY,
        familyVersion: TP_VERSION,
        // Needs to be same as the expected address we create in contract
        // If diffrent we wont get access to put state and get state of the address
        inputs: [address],
        outputs: [address],
        signerPublicKey: signer.getPublicKey().asHex(),
        batcherPublicKey: signer.getPublicKey().asHex(),
        dependencies: [],
        payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
    }).finish()

    const signature = signer.sign(transactionHeaderBytes)

    // Sign the transaction
    const transaction = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: signature,
        payload: payloadBytes
    })

    // Wrap it into list of transaction
    const transactions = [transaction]

    const batchHeaderBytes = protobuf.BatchHeader.encode({
        signerPublicKey: signer.getPublicKey().asHex(),
        transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish()

    // Wrap the transaction list into batch
    const batchSignature = signer.sign(batchHeaderBytes)

    // And sign it
    const batch = protobuf.Batch.create({
        header: batchHeaderBytes,
        headerSignature: batchSignature,
        transactions: transactions
    });

    // Wrap them in batch list
    const batchListBytes = protobuf.BatchList.encode({
        batches: [batch]
    }).finish()
    axios.post(`${API_URL}/batches`, batchListBytes, {
        headers: { 'Content-Type': 'application/octet-stream' }
    }).then(response => {
        console.log({
            address,
            TP_NAMESPACE
        })
        console.log(response.data)

        res.send({
            message: 'submitted',
            data: response.data
        });
    }).catch(error => {
        console.error(error)
        res.send({
            message: 'submitted',
            error: error.response.data
        });
    })

})

app.listen(8080, () => console.log('Server started'));