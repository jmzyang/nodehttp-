var Titles = require('./index2.js');
var mongo = require('mongodb');
var assert = require('assert');
var http = require('http');
var MongoClient = mongo.MongoClient;
var Urls = "mongodb://localhost:27017/demo1";
var Promise = require('promise');
exports.ajax = function(req,res,next){
  function out(err,data){
    MongoClient.connect(Urls,function(err,db){
      assert.equal(null,err);
      db.collection('jmzyang').find().toArray(function(err,res){
        assert.equal(null,err);
        db.close();
        http.createServer(function(req,rsp){
          console.log("request going");
          // rsp.end(res);
        }).listen(3100);
      })
    })
  }
}
