var gtr = require('./gettotalresult.js');
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('./public/teaminfo.json', 'utf8'));

exports.makeTotalResultText = function() {
  var header = '<!doctype html>\
                  <html lang="en">\
                    <head>\
                      <meta http-equiv="Content-type" content="text/html" charset="utf-8">\
                      <title>\
                      </title>\
                      <link rel="stylesheet"href="/stylesheets/style.css"></link>\
                    </head>\
                    <body>\
                      <h1>リーグ別成績表</h1>';

  var tail =         '<br>\
                      <a href="/watch.html" target="_self">戻る</a><br>\
                      <a href="/index.html" target="_self">トップ</a><br>\
                    </body>\
                  </html>';

  for (var key in obj) {

    header += ('<h2>リーグ' + key + '</h2>');
    var res = gtr.getReagueResult(key);
    //console.log(res);
    header += ('<h4>現在一位: ' + res[0] + '</h4>');
    for (var i = 0; i < obj[key].length; i++) {
      header += ('チーム' + obj[key][i] + 'の成績');
      for (var key_p in res[3]) {
        if (obj[key][i] === key_p) {
          header += ('総得点          ...' + res[3][key_p] + '<br>');
          //console.log('point');
        }
      }
      for (var key_times in res[1]) {
        if (obj[key][i] === key_times) {
          header += ('チャイヨー回数     ...' + res[1][key_times] + '<br>');
          //console.log('times');
        }
      }
      for (var key_fast in res[2]) {
        if (obj[key][i] === key_fast) {
          header += ('最速チャイヨータイム ...' + res[2][key_fast] + '<br>');
          //console.log('fast');
        }
      }
    }
  }

  return header + tail;
}
