function getNews(obj){
  var def = {
    url:'',
    output:[],
    filter:'',
    callback:null,
    index:1,
    charset:''
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
      $(def.filter).each(function(index),ele){
        var dom = $(ele);
        def.output.push({
          text:dom.text()
        })
      })
      def.callback(def.output);
    })
  });
}
