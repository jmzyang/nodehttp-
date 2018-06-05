var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
var asy = require('async');
var path = require('path');
var index = 1;
var url = 'http://www.dytt8.net/html/gndy/dyzz/list_23_';
var titles = [];
var assert = require('assert');
var Urls = "mongodb://localhost:27017/demo1";
const express = require('express');
var app =express();
var files = express.static(path.join(__dirname,'file'))
app.use(files);
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1')
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
function getTitle(url,i,callback){
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
        titles.push({
          title:dom.text()
        })
      });
      if (i<2) {
        getTitle(url,++index,callback);
      }else {
        callback(titles);
      }
    })
  });
}
function getnews(obj){
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
        titles.push({
          title:dom.text()
        })
      });
      if (i<2) {
        getTitle(url,++index,callback);
      }else {
        callback(titles);
      }
    })
  });
}
function getNews(obj){
  var def = {
    url:'',
    output:[],
    filters:{},
    callback:null,
    size:1,
    charset:'utf-8',
    along:true
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
      var html = iconv.decode(Buffer.concat(chunks),def.charset);
      var $ = cheerio.load(html,{decodeEntities:false});
      // var index=0;

      for (var i = 0; i < def.size; i++) {
        def.output[i]={};
      }
      console.log(def.url);
        for (var k in def.filters) {
          $(def.filters[k]).each(function(index,ele){
              var dom = $(ele);
              if (k=='urlImg') {
                if (index<def.size) {
                  var nowRead = def.output[index];
                  nowRead[k]=dom[0].attribs.src;
                  // nowRead['id']=dom[0].attribs.href;
                  // console.log(dom[0].attribs);
                }else return;
              }else if(k=='dataSrc'){
                if (def.along) {
                  if (index<def.size) {
                    var nowRead = def.output[index];
                    nowRead[k]=$(dom[0]).attr('data-src');
                  }else return;
                }else {
                  def.output[index]= {};
                  var nowRead = def.output[index];
                  nowRead[k]=$(dom[0]).attr('data-src');
                }
              }else if(k=='ref'){
                if (index<def.size) {
                  var nowRead = def.output[index];
                  nowRead[k]=dom[0].attribs.href;
                  nowRead['id']=index;
                }else return;
              }else if(k=='content'){
                var nowRead = def.output[index];
                nowRead[k]=dom.html()
              }else{
                if (def.along) {
                  if (index<def.size) {
                    var nowRead = def.output[index];
                    nowRead[k]=dom.text().trim();
                  }else return;
                }else {
                  var nowRead = def.output[0];
                  nowRead[index]=dom.text().trim();
                }
              }
          })
        }
      def.callback(def.output);
    })
  });
}
app.get('/getnewslist',function(req,res){
  var tg = {
    output:[],
    url:'http://www.toodaylab.com/',
    filters:{
      urlImg:'.main-list .single-post .post-pic .slide',
      title:'.main-list .single-post .post-info .title',
      des:'.main-list .single-post .post-info .excerpt',
      time:'.main-list .single-post .post-info .left-infos'
    },
    size:5,
    charset:'utf-8',
    callback:function(result){
      res.send({'message':result,status:0});
    }
  }
  getNews(tg);
});
app.get('/getnewsDetail',function(req,res){
  var queryId = req.query.id;
  var tg = {
    output:[],
    url:'http://www.toodaylab.com/'+queryId,
    filters:{
      title:'.top-wrapper .title',
      des:'.main-list .single-post .post-info',
      time:'.top-wrapper .left-infos',
      content:'.single-content .post-content'
    },
    charset:'utf-8',
    callback:function(result){
      res.send({'message':result,status:0});
    }
  }
  getNews(tg);
})
app.get('/getBg',function(req,res){
  // req用于接收参数等进行过滤筛选操作
  var test = {
    output:[],
    url:'http://www.itheima.com/',
    filter:'.bd .li_in img',
    callback:function(result){
      res.send({'bgs':result,status:0});
    }
  }
  getBg(test);
})
app.get('/getCategorys',function(req,res){
  var test = {
    output:[],
    url:'http://www.qdaily.com/tags/1615.html',
    filters:{
      title:'.section-center ul li a',
      ref:'.section-center ul li a'
    },
    // along:false,
    size:11,
    callback:function(result){
      res.send({'message':result,status:0});
    }
  }
  getNews(test);
});
app.get('/getimages',function(req,res){
  var queryId = req.query.id;
  console.log(queryId);
  var test = {
    output:[],
    url:'http://www.qdaily.com/'+queryId,
    filters:{
      dataSrc:'.packery-container .packery-item .grid-banner-article-hd .pic img',
      title:'.packery-container .packery-item .grid-banner-article-bd .title',
      des:'.packery-container .packery-item .grid-banner-article-hd .category ',
      ref:'.packery-container .packery-item>a'
    },
    // along:false,
    size:10,
    callback:function(result){
      res.send({'message':result,status:0});
    }
  }
  getNews(test);
})
app.get('/getphotoinfo',function(req,res){
  var ref = req.query.ref;
  var test = {
    output:[],
    url:"http://www.qdaily.com"+ref,
    filters:{
      content:'.com-article-detail .detail',
      title:'.main .com-article-detail .article-detail-hd .title',
      des:'.main .com-article-detail .article-detail-bd .author '
    },
    // along:false,
    callback:function(result){
      res.send({'message':result,status:0});
    }
  }
  getNews(test);
})
app.get('/getthumimage',function(req,res){
  var ref = req.query.ref;
  var test = {
    output:[],
    url:"http://www.qdaily.com"+ref,
    filters:{
      dataSrc:'.main .com-article-detail .article-detail-bd .com-insert-images img'
    },
     along:false,
    callback:function(result){
      res.send({'message':result,status:0});
    }
  }
  getNews(test);
})
app.get('/getGoods',function(req,res){
  var page = req.query.page;
  var test = {
    output:[],
    url:"http://www.luoo.net/tag/?p="+page,
    filters:{
      text:'.vol-list .item .name',
      favod:'.vol-list .item .favs',
      mess:'.vol-list .item .comments',
      urlImg:'.vol-list .item img',
      ref:'.vol-list .item .cover-wrapper'
    },
    size:10,
    callback:function(result){
      res.send({'message':result,status:0});
    }
  }
  getNews(test);
})
app.get('/getGoodsInfo',function(req,res){
  var ref = req.query.ref;
  console.log(ref);
  var test = {
    output:[],
    url:ref,
    filters:{
      urlImg:'.vol-tracklist ul li .track-detail .player-wrapper img',
      number:'.container .vol-name .vol-number',
      title:'.container .vol-name .vol-title',
      startTime:'.container .vol-meta .vol-date'
    },
    // along:false,
    size:4,
    callback:function(result){
      res.send({'message':result,status:0});
    }
  }
  getNews(test);
})
app.get('/goodsDes',function(req,res){
  var ref = req.query.ref;
  var test = {
    output:[],
    url:ref,
    filters:{
      content:'.container .vol-desc',
      title:'.container .vol-name .vol-title'
    },
    callback:function(result){
      res.send({'message':result,status:0});
    }
  }
  getNews(test);
})
app.listen(3000);
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
function getBg(obj){
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
          url:def.url+dom['0'].attribs.src
        })
      })
      def.callback(def.output);
    });
  })
}
