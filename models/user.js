var Bookshelf = require('../database').bookshelf;
var Promise = require('bluebird');
var Bcrypt = require('bcrypt');
var Boom = require('boom');

var User = Bookshelf.Model.extend({
    tableName: 'user_credentials',
    idAttribute: 'user_id',
    hasTimestamps: true,
}, {
    findUser: function(thisUser) {
        var self = this;
        var promise = new Promise(function(resolve, reject) {
            var params = thisUser.facebook ? { fb_id: thisUser.fb_id } : { email: thisUser.email};
            var checkUser = new User(params)
                .fetch()
                .then(function(existingUser) {
                    return existingUser;
                });
            resolve(checkUser);
        });
        return promise;
    },
    fbRegister: function(thisUser) {
        var promise = new Promise(function(resolve, reject) {
            var newUser = {
                password: "FB_ONLY_ACCOUNT",
                salt: "FB_ONLY_ACCOUNT",
                username: thisUser.username,
                email: thisUser.email,
                fb_id: thisUser.id
            };
            new User(newUser).save().then(function(savedUser) {
                resolve(savedUser.attributes);
            });
        });
        return promise;
    },
    login: Promise.method(function(username, password) {
        if (!username || !password) {
            throw new Error('Username and password are both required');
        }
        return new this({username: username.toLowerCase().trim()}).fetch({require: true}).tap(function(user) {
            return Bcrypt.compare(password, user.get('password'), function(err, res) {
                if(!res) {
                    throw new Error('Invalid password');
                }
            });
        });
    }),

    registerUser: function(thisUser) {
        // create a User object, see if the username exists (this would probably be easier with a simple knex query?)
        var promise = new Promise(function(resolve, reject) {
            var checkUser = new User({username: thisUser.username})
                .fetch()
                .then(function(existingUser) {
                    if (existingUser) {
                        throw new Boom.unauthorized('That username is already in use');
                    }
                    return generatePasswordHash(thisUser).then(function(thisUser) {
                        return saveUser(thisUser).then(function(thisUser) {
                            return thisUser;
                        });
                    });
                });

            var generatePasswordHash = function(thisUser) {
                var promise = new Promise(function(resolve, reject) {
                    Bcrypt.genSalt(10, function(err, salt) {
                        Bcrypt.hash(thisUser.password, salt, function(err, hash) {
                            if (err) {
                                reject(err);
                            } else {
                                thisUser.password = hash;
                                thisUser.salt = salt;
                                resolve(thisUser);
                            }
                        });
                    });
                });
                return promise;
            };

            var saveUser = function(thisUser) {
                var promise = new Promise(function(resolve, reject) {
                    new User(thisUser).save().then(function(savedUser) {
                        resolve(savedUser);
                    });
                });
                return promise;
            };
                resolve(checkUser);
        });
        return promise;
    }
});

exports.User = User;
