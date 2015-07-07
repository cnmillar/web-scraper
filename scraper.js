var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var csvWriter = require('csv-write-stream');
var writer = csvWriter();

request('http://substack.net/images/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	var $ = cheerio.load(body);
  	var permission = $('table tr td:first-child');
  	var urls = $('table tr td:nth-child(3)');

  	var p = [];
  	var u = [];
  	var e = [];

  	permission.each(function(i, element){
  		p.push($(element).text());
  	});

		urls.each(function(i, element){
  		var url = element.children[0].attribs.href;
  		u.push(url);
  		e.push(url.substr(url.indexOf('.')));
  	});

		writer.pipe(fs.createWriteStream('data.csv'));

		for(var i=0; i < p.length - 1; i++){
			writer.write({permission: p[i], url: u[i], extension: e[i]});
		}

		writer.end();
  }
});
