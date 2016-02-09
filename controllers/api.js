var Scraper = require('image-scraper');
var Post = require('../models/post').Post;

exports.newPost = {
    auth: false,
	handler: function (request, reply) {
        console.log(request.payload);
        var newPost = request.payload,
            newPostBody = newPost.body,
            newPostLatitude = newPost.latitude,
            newPostLongitude = newPost.longitude,
            newPostUserId = newPost.user_id;

        return new Post.createPost(newPost)
            .then(function(savedPost) {
                return reply(savedPost);
            }).catch(function(err) {
                console.log(err + ':(');
            });
    }
};

exports.getPosts = {
    auth: false,
	handler: function (request, reply) {
        console.log(request.payload);
        var userId = encodeURIComponent(request.params.user_id);

        return new Post.getPosts(userId)
            .then(function(posts) {
                return reply(posts);
            }).catch(function(err) {
                console.log(err + ':(');
            });
    }
};







exports.scraper = {
    auth: false,
	handler: function (request, reply) {


        var scraper = new Scraper(request.payload.url);
        var imgUrlCollection = [];
        var done = false;

        scraper.scrape(function(image) {
        	imgUrlCollection.push(image.address);
        });

        setTimeout(function(){
            console.log(imgUrlCollection);
            reply({scraped: imgUrlCollection});
        }, 1000);
    }
};
