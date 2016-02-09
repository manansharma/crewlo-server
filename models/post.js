var Bookshelf = require('../database').bookshelf;
var Promise = require('bluebird');
var Boom = require('boom');

var Post = Bookshelf.Model.extend({
    tableName: 'posts',
    idAttribute: 'id',
    hasTimestamps: true,
}, {
    createPost: function(newPost) {
        var promise = new Promise(function(resolve, reject) {
            new Post(newPost).save().then(function(savedPost) {
                resolve(savedPost);
            });
        });
        return promise;
    },
    getPosts: function(user_id) {
        var promise = new Promise(function(resolve, reject) {
            var findPosts = new Post({'user_id': user_id})
                .fetchAll()
                .then(function(posts) {
                    console.log(posts);
                    return posts;
                });
            resolve(findPosts);
        });
        return promise;
    },
    findByFbId: function(_id) {
        var promise = new Promise(function(resolve, reject) {
            var findUser = new User({'fb_id': fb_id})
                .fetch()
                .then(function(existingUser) {
                    return existingUser;
                });
            resolve(findUser);
        });
        return promise;
    },


    facebookRegister: function(fbUser) {
        var promise = new Promise(function(resolve, reject) {
            var newUser = {
                password: "FB_ONLY_ACCOUNT",
                salt: "FB_ONLY_ACCOUNT",
                username: fbUser.username,
                email: fbUser.email,
                fb_id: fbUser.fb_id
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

exports.Post = Post;
