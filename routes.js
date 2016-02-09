var Pages = require('./controllers/pages');
var Authentication = require('./controllers/authentication');
var Api = require('./controllers/api');

exports.endpoints = [
    { method: 'POST',   path: '/register',                  config: Authentication.register             },
    { method: 'POST',   path: '/login',                     config: Authentication.login                },
    { method: 'POST',   path: '/renew',                     config: Authentication.renew                },
    { method: 'POST',   path: '/scraper',                   config: Api.scraper                         },
    { method: 'GET',    path: '/logout',                    config: Authentication.logout               },
    { method: 'GET',    path: '/users',                     config: Authentication.users                },
    { method: 'POST',   path: '/facebook/authorize',        config: Authentication.facebookAuthorize    },
    { method: 'POST',   path: '/api/v1/posts',              config: Api.newPost                         },
    { method: 'GET',    path: '/api/v1/posts/{user_id}',    config: Api.getPosts                        },
    { method: 'GET',    path: '/{param*}',                  config: Pages.index                         } // TODO: index must DIE!
];
