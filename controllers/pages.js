exports.index = {
    auth: false,
    handler: function (request, reply) {            //production TODO:update this           //development
        var destination = process.env.PORT ? 'http://d1rgtsqhwmm9xq.cloudfront.net/' : 'http://localhost:4200';
        reply.redirect(destination);
    }
};
