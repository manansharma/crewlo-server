var Joi = require('joi');
var Bcrypt = require('bcrypt');
var Promise = require('bluebird');
var Boom = require('boom');
var User = require('../models/user').User;
var jwtSign = require('../auth_jwt').jwtSign;

exports.login = {
	validate: {
        payload: {
            username: Joi.string().required(),
            password: Joi.string().min(2).max(200).required()
        }
    },
    auth: false,
	handler: function (request, reply) {
        User.login(request.payload.username, request.payload.password)
            .then(function(user) {
                // do something?
                return createWebToken(user.attributes);
            }).catch(User.NotFoundError, function() {
                console.log(1);
                reply({error: 'error, username not found'});
            }).catch(function(err) {
                console.log(2);
                reply({error: err});
            });

            var createWebToken = function(user) {
                var token = jwtSign(user);
                return reply({token: token}).header("Authorization", token);
            };
    }
};

exports.renew = {
    //auth: 'jwt',
	handler: function (request, reply) {
        console.log('renewing!');
        var token = jwtSign(request.payload);
        console.log(token);
        reply({token: token})
            .header("Authorization", token);
    }
};

exports.users = {
    auth: 'jwt',
	handler: function (request, reply) {
        console.log('something');
        reply({text: "hey look at you using tokens!"})
            .header("Authorization", request.headers.authorization);
    }
};


exports.logout = {
	handler: function (request, reply) {
        request.auth.session.clear();
        return reply('Logout Successful!');
    }
};

exports.register = {
    auth: false,
	validate: {
        payload: {
            username: Joi.string().required(),
            password: Joi.string().min(2).max(200).required(),
            email: Joi.string().required()
        }
    },
	handler: function (request, reply) {
        console.log(request.payload);
        return User.registerUser(request.payload)
            .then(function(result) {
                console.log(result);
                return reply(result);
            }).catch(Boom.unauthorized , function(err) {
                reply(err);
            }).catch(function(err) {
                console.log(err + ' ya suck');
            });
    }
};






exports.facebookAuthorize = {
    auth: false,
	handler: function (request, reply) {
        console.log(request.payload);
        var fb_user = request.payload,
            fb_id = request.payload.fb_id,
            email = request.payload.email;

        var facebookRegister = function(fbUser) {
            User.facebookRegister(fbUser)
                .then(function(newUser) {
                    return reply(newUser);
                }).catch(function(err) {
                    console.log(err);
                    return reply({err: err});
                });
        };

        return User.findByFbId(fb_id)
            .then(function(user) {
                if (!user) {
                    return facebookRegister(fb_user);
                } else {
                    return reply(user);
                }
            }).catch(function(err) {
                console.log(err + ':(');
            });
        //return reply({status: 'successs', message: 'Congratulations!'});
    }
};
