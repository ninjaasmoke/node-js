var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// with token and passport

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 }) // expires after 1 hour (3600 s)
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // similar to basic auth
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_paylod, done) => {
    console.log("Jwt payload", jwt_paylod);
    User.findOne({ _id: jwt_paylod._id }, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
}));


exports.verifyUser = passport.authenticate('jwt', { session: false });  // can be used anywhere to check authenticity

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next()
    }
    else {
        err = new Error("You are not authorized to perform this operation!")
        err.status = 403
        return next(err)
    }
}


exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user != null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err) {
                    return done(err, false);
                } else {
                    return done(null, user);
                }
            });
        }
    });
}));