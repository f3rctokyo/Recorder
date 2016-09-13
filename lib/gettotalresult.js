var fs = require("fs")
var gml = require("./getmatchlist.js")

var path = './storage/qualification/';

//data_about_team []

exports.getReagueResult = function(group) {
  var results = [];
  var winner = [];
  var wintimes = {};
  var teampoints = {};
  var teamchaiyo = {};
  var fastchaiyo = {};
  var winflag = false;
  var files = gml.getMatchList('qualification');

  var obj = JSON.parse(fs.readFileSync('./public/teaminfo.json', 'utf8'));
  for (var key in obj) {
    if (key === group) {
      for (var i = 0; i < obj[key].length; i++) {
        //console.log(obj[key][i]);
        wintimes[obj[key][i]] = 0;
        teampoints[obj[key][i]] = 0;
        teamchaiyo[obj[key][i]] = 0;
        fastchaiyo[obj[key][i]] = 180;
      }
    }
  }

  function submit() {
    if (winflag == false) {
      console.log('submiting');
      results.push(winner);
      results.push(teamchaiyo);
      results.push(fastchaiyo);
      results.push(teampoints);
    }
  }

  //console.log(teampoints);
  files.forEach(function(filename) {
    if (filename.slice(filename.indexOf('|') - 1, filename.indexOf('|')) === group) {
      var obj = JSON.parse(fs.readFileSync(path + filename, 'utf8'));
      teampoints[filename.slice(filename.indexOf('_') + 1, filename.indexOf('vs'))] += obj['points_1'];
      teampoints[filename.slice(filename.indexOf('vs') + 2, filename.indexOf('.json'))] += obj['points_2'];

      if (obj['winner'] == 'team1') {
        wintimes[filename.slice(filename.indexOf('_') + 1, filename.indexOf('vs'))] += 1;
      } else {
        wintimes[filename.slice(filename.indexOf('vs') + 2, filename.indexOf('.json'))] += 1;
      }

      if (obj['vgoal'] == 'on') {
        if (obj['winner'] == 'team1') {
          console.log('T1');
          teamchaiyo[filename.slice(filename.indexOf('_') + 1, filename.indexOf('vs'))] += 1;
          if (fastchaiyo[filename.slice(filename.indexOf('_') + 1, filename.indexOf('vs'))] > obj['chaiyotime']) {
            fastchaiyo[filename.slice(filename.indexOf('_') + 1, filename.indexOf('vs'))] = obj['chaiyotime'];
          }
        } else {
          console.log('T2');
          teamchaiyo[filename.slice(filename.indexOf('vs') + 2, filename.indexOf('.json'))] += 1;
          console.log(obj['chaiyotime']);
          console.log(fastchaiyo[filename.slice(filename.indexOf('vs') + 2, filename.indexOf('.json'))]);
          console.log(filename.slice(filename.indexOf('vs') + 2, filename.indexOf('.json')));
          if (fastchaiyo[filename.slice(filename.indexOf('vs') + 2, filename.indexOf('.json'))] > obj['chaiyotime']) {
            console.log('small');
            fastchaiyo[filename.slice(filename.indexOf('vs') + 2, filename.indexOf('.json'))] = obj['chaiyotime'];
          }
        }
      }
    }
  });
  console.log('>>>>>>>>>>>>>>>>>>>');
  console.log(fastchaiyo);
  var tempwin = 0;
  var tempwinnerlist = [];
  for (key in wintimes) {
    tempwinnerlist.push(key);
  }

  tempwinnerlist.forEach(function(val, index, winteam) {
    if (wintimes[val] > tempwin) {
      console.log('large ************');
      tempwin = wintimes[val];
      winner = [];
      winner.push(val);
    } else if (wintimes[val] == tempwin) {
      winner.push(val);
    }
  });

  if (winner.length == 1) {
    console.log('<wintimes>');
    submit();
    winflag = true;
  }
  var timeswinner = [];
  var tempchaiyo = 0;

  tempwinnerlist = [];
  for (key in teamchaiyo) {
    tempwinnerlist.push(key)
  }
  console.log('&&&&&&&&&&');
  console.log(teamchaiyo);

  console.log('tempwinnerlist');
  console.log(tempwinnerlist);
  tempwinnerlist.forEach(function(val, index, tempwinnerlist) {
    for (var j = 0; j < winner.length; j++) {
      if (winner[j] == val) {
        console.log(val);
        console.log(teamchaiyo);
        if (teamchaiyo[val] > tempchaiyo) {
          console.log('bigger');
          timeswinner = [];
          timeswinner.push(val);
          tempchaiyo = teamchaiyo[val];
        } else if (teamchaiyo[val] == tempchaiyo) {
          timeswinner.push(val);
        }
      }
    }
  });
  winner = timeswinner;
  if (winner.length == 1) {
    submit();
    winflag = true;
  }

  var fastwinner = [];
  var tempfast = 180;

  tempwinnerlist = [];
  for (key in fastchaiyo) {
    tempwinnerlist.push(key)
  }

  tempwinnerlist.forEach(function(val, index, tempwinnerlist) {
    for (var j = 0; j < winner.length; j++) {
      if (winner[j] == val) {
        if (fastchaiyo[val] < tempfast) {
          fastwinner = [];
          fastwinner.push(val);
          tempfast = fastchaiyo[val];
        } else if (fastchaiyo[val] == tempfast) {
          fastwinner.push(val);
        }
      }
    }
  });
  winner = fastwinner;
  submit();

  console.log(results);
  return results;
}
