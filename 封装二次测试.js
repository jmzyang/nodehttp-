var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
function getData(obj){
  var def = {
    url:'',
    output:[],
    filter:'',
    callback:null
  }
  for (var k in obj) {
    def[k] = obj[k];
  }

  http.get(def.url,function(res){
    var chunks = [];
    res.on('data',function(chunk){
      chunks.push(chunk);
    });
    res.on('end',function(){
      var html = iconv.decode(Buffer.concat(chunks),'utf-8');
      var $ = cheerio.load(html,{decodeEntities:false});
      $(def.filter).each(function(index,ele){
        var dom = $(ele);
        def.output.push({
          url:dom['0'].attribs.src
        })
      })
      def.callback(def.output);
    });
  })
}
var url = 'http://www.itheima.com/';
var test = {
  output:[],
  url:url,
  filter:'.bd .li_in img',
  callback:function(result){
    console.log(result);
  }
}
getData(test);
