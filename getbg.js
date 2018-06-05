var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
var url = 'http://www.itheima.com/';
var bgs = [];
http.get(url,function(res){
  var chunks = [];
  res.on('data',function(chunk){
    chunks.push(chunk);
  });
  res.on('end',function(){
    var html = iconv.decode(Buffer.concat(chunks),'utf-8');
    var $ = cheerio.load(html,{decodeEntities:false});
    $('.bd .li_in img').each(function(index,ele){
      var dom = $(ele);
      console.log();
      bgs.push({
        url:dom['0'].attribs.src
      })
    })
    console.log(bgs);
  });
})
