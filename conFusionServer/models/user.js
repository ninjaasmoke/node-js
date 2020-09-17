var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    // username: { // auto added by passport
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    // password: {
    //     type: String,
    //     required: true,
    // },
    // for mongoose population in dishes for comments
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId: String,
    // for fb login - oauth 2
    admin: {
        type: Boolean,
        default: false,
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);