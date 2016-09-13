var path = "./storage/";
var fs = require("fs");

// 同期的にディレクトリ内にあるファイル名の一覧を配列で取得
// "." と ".." は含まれない

exports.getMatchList = function(matchlevel='qualification') {
  var abspath = path + matchlevel;
  var filelist = [];
  var files = fs.readdirSync(abspath);
  files.forEach(function(file){
    console.log(file);
    filelist.push(file);
  });

  return filelist;
}
