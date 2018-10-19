const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const BasicStrategy = require('passport-http').BasicStrategy;
const passport = require('passport');

const User = require('../models/user'); // load up the user model
const config = require('../configs/env'); // get db config file


let opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secret_key;

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    
    User.findOne({
        email: jwt_payload.sub.email
    }, function (err, user) {

        if (err) {
            return done(err, false);
        }

        if (user) {
            return done(null, { id: user._id, email: user.email });
        } else {
            return done(null, false);
        }
    });
}));

passport.use(new BasicStrategy(
    function (email, password, done) {
        User.findOne({
            email: email
        }, function (err, user) {

            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }
            console.log(user);
            
            user.comparePassword(password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    if (user.verified && user.openshift) {
                        var returnData = {
                            "sub": user._id.toString(),
                            "preferred_username": user.name,
                            "name": user.name,
                            "email": user.email
                        }
                        return done(null, returnData);
                    } else {
                        return done(null, false);
                    }
                } else {
                    return done(null, false);
                }
            });
        });
    }
));

module.exports = {
    AuthenticatedJWT: passport.authenticate(['jwt'], { session: false }),
    AuthenticatedBasic: passport.authenticate(['basic'], { session: false })
}