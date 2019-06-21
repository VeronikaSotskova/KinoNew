const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {
            //Match User when login
            User.findOne({
                email: email
            }).then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Пользователь с почтой данной почтой не зарегистрирован!'});
                    }
                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Неправильный пароль'});
                        }
                    });
                });

        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id,  (err, user) => {
            done(err, user);
        });
    });
};