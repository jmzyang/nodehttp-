var asy = require('async');
var Promise = require('promise');
//
// asy.waterfall([
//   function(callback){
//     callback(null,'one','two')
//   },
//   function(arg1,arg2,callback){
//     console.log('arg1:'+arg1+'===arg2:'+arg2);
//     callback(null, 'three');
//   },
//   function(arg1,callback){
//     callback(null, 'done');
//   }
// ],function(err,res){
//   console.log(res);
// });
function test(resolve, reject) {
    var timeOut = Math.random() * 2;
    console.log('set timeout to: ' + timeOut + ' seconds.');
    setTimeout(function () {
        if (timeOut < 1) {
            console.log('call resolve()...');
            resolve('200 OK');
        }
        else {
            console.log('call reject()...');
            reject('timeout in ' + timeOut + ' seconds.');
        }
    }, timeOut * 1000);
}

var p1=new Promise(test);
var p2 = p1.then(function(res){
  console.log('成功'+res);
});
var p3 = p2.catch(function(err){
  console.log('失败');
})
