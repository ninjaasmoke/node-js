const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';


// Callback Hell
// MongoClient.connect(url, (err, client) => {


//     assert.equal(err, null);

//     console.log('Connected correctly to server');

//     const db = client.db(dbname);
//     dboper.insertDocument(db, { name: "Vadonut", description: 'Text' }, 'dishes', (result) => {
//         console.log('Insert Document:\n', result.ops);

//         dboper.findDocuments(db, 'dishes', (docs) => {
//             console.log('Found docs:\n', docs);

//             dboper.updateDocument(db, { name: 'Vadonut' }, { description: 'Updated Test' }, 'dishes', (result) => {
//                 console.log('Updated Document:\n', result.result);

//                 dboper.findDocuments(db, 'dishes', (docs) => {
//                     console.log('Found docs:\n', docs);

//                     db.dropCollection('dishes', (result) => {
//                         console.log('Dropped collections: ', result);

//                         client.close();
//                     });
//                 });

//             });
//         });
//     });
// }
// );

// Using promises

MongoClient.connect(url).then((client) => {
    console.log('Connected correctly to server');

    const db = client.db(dbname);
    dboper.insertDocument(db, { name: "Vadonut", description: 'Text' }, 'dishes')
        .then((result) => {
            console.log('Insert Document:\n', result.ops);

            return dboper.findDocuments(db, 'dishes')
        })
        .then((docs) => {
            console.log('Found docs:\n', docs);

            return dboper.updateDocument(db, { name: 'Vadonut' }, { description: 'Updated Test' }, 'dishes')
        })
        .then((result) => {
            console.log('Updated Document:\n', result.result);

            return dboper.findDocuments(db, 'dishes')
        })
        .then((docs) => {
            console.log('Found docs:\n', docs);

            return db.dropCollection('dishes')
        }).then((result) => {
            console.log('Dropped collections: ', result);

            client.close();
        }).catch((err) => {
            console.error(err);
        });
})
    .catch((err) => {
        console.error(err);
    });