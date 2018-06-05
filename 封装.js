var cheerio = require('cheerio');//拓展api 类似于jquery
var http = require('http'); //http模块
var iconv = require('iconv-lite');//转码
var index = 1;//默认索引页数
var url = 'xxx'//变量
var titles = [];//数据容器
var express = require('express');//拓展api
var app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});//允许请求响应跨域
function getData(obj){
  var def = {
    index:1,
    url:'',
    chose:'',
    dataName:'',
    tp:'text'
  }
  for (var k in obj) {
      def[k]=obj[k];
  }
  http.get(obj.url+obj.index+'.html',res=>{
    console.log(def);
    var chunks = [];
    res.on('data',function(chunk){
      chunks.push(chunk);
    });
    res.on('end',function(){
      var html = iconv.decode(Buffer.concat(chunks),'gb2312');
      var $ = cheerio.load(html,{decodeEntities:false});
      var asyRes = $('.co_content8 .ulink');
      $(def.chose).each(function(index,ele){
        var dom = $(ele);
        // if (def.tp == 'text') {
          titles.push({
            title:dom.text()
          })
        // }
      });
      if (obj.index<2) {
        getTitle(url,++index);
      }else {
        // app.get('/getTitle',function(req,res){
        //   res.send({'title':titles});
        // })
        console.log(titles);
      }
    })
  });
}
getData({
  url : 'http://www.dytt8.net/html/gndy/dyzz/list_23_',
  dataName : 'title',
  chose : '.co_content8 .ulink'
});
