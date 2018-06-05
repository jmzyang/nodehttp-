var Titles = require('./index2.js');
var mongo = require('mongodb');
var assert = require('assert');
var MongoClient = mongo.MongoClient;
var Urls = "mongodb://localhost:27017/demo1";
var Promise = require('promise');
var titles = [];
function out(){
  MongoClient.connect(Urls,function(err,db){
    assert.equal(null,err);
    db.collection('jmzyang').find().toArray(function(err,res){
      assert.equal(null,err);
      console.log(res);
      titles = res;
      db.close();
    })
  })
}
out();
console.log(titles);
