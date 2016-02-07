var Scraper = require('image-scraper');

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
