var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var qs = require('querystring');
//var exec = require('child_process').exec;
var gml = require('./lib/getmatchlist.js');
var mrt = require('./lib/makeresulttext.js');
var mtrt = require('./lib/maketotalresulttext.js');

var cache = [];

function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: SONNA FILE NE-YO BAKA.');
  response.end();
}

function sendFile(response, filepath, filecontents) {
  response.writeHead(
    200,
    {"Content-Type": mime.lookup(path.basename(filepath))}
  );
  response.end(filecontents);
}

function serveStatic(response, absPath) {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(response);
          } else {
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response);
      }
    });
}

var savefilepath = false;
var tempdata = false;

var server = http.createServer(function(req, res) {
  if (req.url === '/metadata' && req.method === 'POST') {
    var body = '';
    req.setEncoding('utf8');

    console.log("read");
    req.on('readable', function(chunk) {
      body += req.read()
    });
    req.on('end', function() {
      processing = true;
      var savefilename = false;
      //console.log(typeof body);
      body = body.substring(0, body.length - 4);

      console.log(body);
      var obj = qs.parse(body);
      //console.log(typeof obj);
      var jsonobj = JSON.stringify(obj);
      //console.log(obj["matchtype"]);
      savefilename = 'match' + obj ["matchreague"] + '|' + obj["matchnum"] + '_' + obj["team1name"] + 'vs' + obj["team2name"] + '.json';
      if (obj["matchtype"] === 'final') {
        console.log('final reague');
        savefilepath = './storage/final/';
      } else if (obj["matchtype"] === 'qualification') {
        console.log('qualification reague');
        savefilepath = './storage/qualification/';
      }
      savefilepath += savefilename;
      console.log(savefilepath);
    });
  }

  if (req.url === '/result' && req.method === 'POST') {
    var body = '';
    req.setEncoding('utf8');

    console.log("read");
    req.on('readable', function(chunk) {
      body += req.read()
    });
    req.on('end', function() {
      //console.log(typeof body);
      body = body.substring(0, body.length - 4);

      console.log(body);
      var obj = qs.parse(body);
      //console.log(typeof obj);

      var chaiyotime = parseInt(obj["vtime"].slice(0, 1)) * 60 + parseInt(obj["vtime"].slice(2));
      var points_1 =-(parseInt(obj["destroy"][0]) * 50) + (parseInt(obj["getobj_p"][0]) * 10) + (parseInt(obj["getobj_f"][0]) * 10);
      var points_2 = -(parseInt(obj["destroy"][1]) * 50) + (parseInt(obj["getobj_p"][1]) * 10) + (parseInt(obj["getobj_f"][1]) * 10);

      var ite = 0;
      var temp_dc = [];
      for (var count = 0; count < 10; count++) {
      //for (key in obj['height']) {
        if (obj['height'][count] != '') {
          var n = parseInt(obj['height'][count]);
          if (obj['donatecolor'][ite] == 'blue') {
            points_1 += (5 * n * (n + 3)) / 2;
          } else {
            points_2 += (5 * n * (n + 3)) / 2;
          }
          temp_dc.push(obj['donatecolor'][ite]);
          ite++;
        } else {
          temp_dc.push('');
        }
      }

      obj["chaiyotime"] = chaiyotime;
      obj["points_1"] = points_1;
      obj["points_2"] = points_2;
      obj['donatecolor'] = temp_dc;

      var jsonobj = JSON.stringify(obj);
      console.log(jsonobj);
      console.log(savefilepath);
      tempdata = jsonobj;

      if (cache.indexOf(savefilepath) != -1) {
        fs.writeFile(savefilepath, jsonobj);
      }
    });
  }

  if (req.url === '/confirm_ok' && req.method === 'POST') {
    var body = '';
    req.setEncoding('utf8');

    console.log("read");
    req.on('readable', function(chunk) {
      body += req.read()
    });
    req.on('end', function() {
      body = body.substring(0, body.length - 4);

      var obj = qs.parse(body);
      if (obj["conf"] === 'ok') {
        fs.writeFile(savefilepath, tempdata);
      }
    });
  }

  var filepath = false;
  if (req.url == '/') {
    filepath = 'public/index.html';
  } else if (req.url == '') {
    filepath = 'public/index.html';
    /*
  } else if (req.url == '/watch.html') {
    //TODO: 閲覧用のソフトを起��?
    console.log('watching');
    //exec('python ./Analizer/visualize.py', function(err, stdout, stderr){
      /* some process */
    /*
    });

    filepath = 'public/index.html';
    */
  } else {
    filepath = 'public' + req.url;
  }

  switch (req.method) {
    case 'GET':
      console.log('GET.');
      break;
    case 'POST':
      console.log('POST.');
      if (req.url === '/metadata') {
        console.log(cache);
        console.log(cache.indexOf(savefilepath));
        filepath = 'public/result.html';
      } else if (req.url === '/result') {
        //TODO: confirmation is needed
        if (cache.indexOf(savefilepath) != -1) {
          filepath = 'public/confirm.html';
        } else {
          filepath = 'public/index.html';
          cache.push(savefilepath);
        }
      } else if (req.url === '/confirm_ok') {
        filepath = 'public/index.html'
      }
      break;
    default:
      console.log('Invalid request.');
  }

  var absPath = './' + filepath;
  if (filepath === 'public/watch.html') {
    var text_f = fs.readFileSync('./public/watch_f.html', 'utf-8');
    var text_m = '<br><h3>決勝</h3>';
    var text_t = '<h3>総合</h3><a href="/totalmatch.html" target="_self">現在の順位を見る</a>'
    var text_b = fs.readFileSync('./public/watch_b.html', 'utf-8');
    console.log(text_b);

    var q_list = gml.getMatchList('qualification');
    var f_list = gml.getMatchList('final');

    var text_qualification = '';
    var text_final = '';


    for (var i = 0; i < q_list.length; i++) {
      text_qualification += '<a href="/';
      text_qualification += q_list[i];
      text_qualification += '.html" target="_self">';
      text_qualification += q_list[i];
      text_qualification += '</a><br>';
    }

    for (var i = 0; i < f_list.length; i++) {
      text_qualification += '<a href="/';
      text_qualification += f_list[i];
      text_qualification += '.html" target="_self">';
      text_qualification += f_list[i];
      text_qualification += '</a><br>';
    }

    var text = text_f + text_qualification + text_m + text_final + text_t + text_b;
    //console.log(text);

    fs.writeFileSync('./storage/Temp/temp.html', text);
    absPath = './storage/Temp/temp.html';
  } else if (filepath === 'public/totalmatch.html') {
    fs.writeFileSync('./storage/Temp/totalresult.html', mtrt.makeTotalResultText());
    absPath = './storage/Temp/totalresult.html';
  } else if (filepath.indexOf('json') != -1) {
    //console.log(filepath.slice(filepath.indexOf('/') + 1, filepath.indexOf('html') - 1));
    var text = mrt.makeResultText('qualification', filepath.slice(filepath.indexOf('/') + 1, filepath.indexOf('html') - 1));
    fs.writeFileSync('./storage/Temp/match.html', text);
    absPath = './storage/Temp/match.html';
  }
  serveStatic(res, absPath);
});
server.listen(45678, function() {
    console.log("server listening on port 45678");
});
