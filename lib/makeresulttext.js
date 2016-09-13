var fs = require("fs")

exports.makeResultText = function(matchlevel, matchname) {
  if (matchlevel === 'final') {
    var filename = './storage/final/' + matchname;
    var pre_info = '決勝';
  } else {
    var filename = './storage/qualification/' + matchname;
    var pre_info = '予選';
  }
  var obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
  //return obj['vgoal'];

  var header1 = '<!doctype html>\
                  <html lang="en">\
                    <head>\
                      <meta http-equiv="Content-type" content="text/html" charset="utf-8">\
                      <title>';
  var header2 = '\
                      </title>\
                      <link rel="stylesheet" href="/stylesheets/style.css"><link>\
                    </head>\
                    <body>';
  var header = header1 + matchname + header2;
  var pre_tail = '<br><h5>追記</h5>' + obj['comment'] + '<br>';
  var tail = '\
                      <br>\
                      <a href="/watch.html" target="_self">戻る</a>\
                      <a href="/index.html" target="_self">トップ</a>\
                    </body>\
                  </html>';


  //TODO: 情報の追加
  var meta = '<h1>'
                + pre_info + '第' + matchname.slice(matchname.indexOf('_') - 1, matchname.indexOf('_')) + '試合'
           + '</h1>'
           + '<h2>';

  var winteam = '';
  team1name = matchname.slice(matchname.indexOf('_') + 1, matchname.indexOf('vs'));
  team2name = matchname.slice(matchname.indexOf('vs') + 2, matchname.indexOf('.json'));
  if (obj['winner'] == 'team1') {
    winteam = team1name;
  } else {
    winteam = team2name;
  }
  meta +=      ('勝者: ' + winteam
           + '</h2>');

  if (obj['vgoal'] == 'on') {
    meta += ('Vゴール達成<br>' + 'Vゴールタイム: ' + obj['vtime'] + '<br>');
  }



  meta += '<h2>\
              得点情報\
           </h2>'


  //team1
  var main = '<h3>チーム　＜'
              + team1name
           + '＞</h3>';
  main += ('受け渡しゾーンのオブジェクト: ' + obj['getobj_p'][0] + '<br>');
  main += ('支配陣地内のオブジェクト: ' + obj['getobj_f'][0] + '<br>');
  main += ('崩した回数: ' + obj['destroy'][0] + '<br>');
  main += ('リトライ回数: ' + obj['retry'][0] + '<br>');
  main += ('違反回数: ' + obj['invalid'][0] + '<br>');
  main += ('合計得点: ' + obj['points_1'] + '<br>');

  //team2
  main += ('<h3>チーム　＜'
            + team2name
         + '＞</h3>');
  main += ('受け渡しゾーンのオブジェクト: ' + obj['getobj_p'][1] + '<br>');
  main += ('支配陣地内のオブジェクト: ' + obj['getobj_f'][1] + '<br>');
  main += ('崩した回数: ' + obj['destroy'][1] + '<br>');
  main += ('リトライ回数: ' + obj['retry'][1] + '<br>');
  main += ('違反回数: ' + obj['invalid'][1] + '<br>');
  main += ('合計得点: ' + obj['points_2'] + '<br>');



  var text = header + meta + main + tail;

  return text;
}
