var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
var asy = require('async');
var index = 1;
var url = 'http://www.dytt8.net/html/gndy/dyzz/list_23_';
var titles = [];
var assert = require('assert');
var Urls = "mongodb://localhost:27017/demo1";
function getTitle(url,i){
  console.log('正在获取第'+i+'页的内容');
    http.get(url+i+'.html',res=>{
    var chunks = [];
    res.on('data',function(chunk){
      chunks.push(chunk);
    });
    res.on('end',function(){
      var html = iconv.decode(Buffer.concat(chunks),'gb2312');
      var $ = cheerio.load(html,{decodeEntities:false});
      var asyRes = $('.co_content8 .ulink');
      $('.co_content8 .ulink').each(function(index,ele){
        var dom = $(ele);
        // console.log(dom.getAttribute('href'));
        titles.push({
          dom
          // title:dom.text()
        })
      });
      if (i<2) {
        getTitle(url,++index);
      }else {
        console.log(titles[0]['dom']['0'].attribs.href);
        // console.log(titles);
        // if (titles) {
        //   save(titles);
        // }
      }
    })
  });
}
function save(test){
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(Urls,function(err,db){
    if (err) {
      console.error(err);
      return;
    }else {
      console.log('成功连接数据库');
      var collection = db.collection('jmzyang');
      collection.insertMany(test,function(err,res){
        if (err) {
          console.error(err);
          return;
        }else{
          console.log('保存数据成功');
        }
      })
    }
    db.close();
  });
}
function getBtLink(urls,n){
  console.log('正在获取第'+n+'个url内容');
  http.get('')
}
function main(){
  getTitle(url,index);
}
main();
