const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const favouriteSchema = new Schema({
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    favouriteDishes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }
    ]
}, {
    timestamps: true
});

var Favourites = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourites;