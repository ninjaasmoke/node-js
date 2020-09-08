const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log('\nConnected correctly to server');

    Dishes.create({
        name: 'Uthappiza',
        description: 'test'
    })
        .then((dish) => {
            console.log('\nDish\n');
            console.log(dish);

            return Dishes.find({}).exec();
        })
        .then((dishes) => {
            console.log('\nAll dishes\n');
            console.log(dishes);

            return Dishes.remove({});
        })
        .then(() => {
            return mongoose.connection.close();
        })
        .catch((err) => {
            console.error(err);
        });
});