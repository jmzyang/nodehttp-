var arr = [];
function runAsync(){
  var p = new Promise(function(resolve,reject){
    setTimeout(function () {
      console.log('执行完成');
      resolve([0,1,2,3,4,5]);
    }, 2000);
  })
  return p;
}
runAsync().then(function(data){
  // console.log(data);
  arr = data;
  // console.log(arr);
  module.exports = {
    'arr':arr
  }
})
