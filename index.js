var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
var url = 'http://www.dytt8.net/';

http.get(url,function(res){
  var chunks = [];
  res.on('data',function(chunk){
    chunks.push(chunk);
  });
  res.on('end',function(){
    var titles = [];
    var html = iconv.decode(Buffer.concat(chunks),'gb2312');
    var $ = cheerio.load(html,{decodeEntities:false});
    $('.co_content8 .inddline').each(function(index,ele){
      var $element = $(ele);
      titles.push({
        title:$element.text()
      })
    })
  });
});
