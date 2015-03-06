var stationList = require('./data/stations.js');
var carparkList = require('./data/carparks.js');

var mysql = require('mysql');

var mysql_con = mysql.createConnection({
  host: 'ciscohack.cztpnl40s1bu.eu-west-1.rds.amazonaws.com',
  user: 'sheffield',
  password: 'thisissosecure',
  database: 'CiscoHack'
});

mysql_con.connect(function(err) {if (err) throw err});

var keys = [
  [0,.2],
  [4,.2],
  [8,1],
  [10,.6],
  [12,.8],
  [15,.6],
  [18,1],
  [20,.2],
  [24,.2]
];

var k = [[0, 16, 32, 40, 48, 60, 72, 80, 96], [.2, .2, 1, .6, .8, .6, 1, .2, .2]];

var time = 0;
var proportion = 0;

function bias(val, bias) {
  val = val + (Math.random() * (2 * bias)) - bias;
  if (val > 1) val = 1;
  else if (val < 0.1) val = 0.1;
  return val;
}

function getLower(t) {
  for (var ki=0; ki<k[0].length; ki++) {
    if (k[0][ki] > t)
      return [k[0][ki-1], k[1][ki-1]];
  }
}

function getHigher(t) {
  for (var ki=0; ki<k[0].length; ki++) {
    if (k[0][ki] > t)
      return [k[0][ki], k[1][ki]];
  }
}

function getProportion(ti, delay) {
  var t = (ti - delay) % 96;
  var io = k[0].indexOf(t);
  if (io > -1)
    return k[1][io];
  else {
    var lower = getLower(t), higher = getHigher(t);
    var higherProportion = (t - lower[0]) / (higher[0] - lower[0]), lowerProportion = 1 - higherProportion;
    var t_proportion = lowerProportion * lower[1] + higherProportion * higher[1];
    return t_proportion;
  }
}

function getPeople(name) {
  return Math.floor((stationList[name].max_people) * bias(getProportion(time, stationList[name].delay), 0.1));

}

function getSpaces(name) {
  return carparkList[name].capacity - Math.floor(carparkList[name].capacity * bias(getProportion(time, 0), 0.1));
}

function getStations() {
  var result = [], l;
  for (l in stationList) {
    result.push({
      name: l,
      people: getPeople(l)
    });
  }
  return result;
}

function getCarParks() {
  var result = [], l;
  for (l in carparkList) {
    result.push({
      name: l,
      spaces: getSpaces(l)
    });
  }
  return result;
}

function getRoadUsage(callback) {
  var zero = ('0' + (time*15)%60).slice(-2);
  var timestamp = '2015/02/23 ' + Math.floor((time*15)/60) + ':' + zero;
  var result;
  var query = mysql_con.query("SELECT l.cosit, l.start_grid, l.end_grid, f.journeys, f.count FROM link as l LEFT JOIN (select * from full where time='" + timestamp + "') as f ON l.cosit=f.cosit;", function(err,rows){
    result = rows;
    callback({
      stations: getStations(),
      carParks: getCarParks(),
      roadUsage: rows,
      t: time
    });
  });
  return result;
}

module.exports = {
  getData: function(callback) {
    time = (time + 1) % 96;
    getRoadUsage(callback);
  },
  getStationInfo: function() {
    var result = [];
    for (var l in stationList) {
      result.push({
        name: l,
        longitude: stationList[l].longitude,
        latitude: stationList[l].latitude,
        threshold: stationList[l].threshold
      });
    }
    return result;
  },
  getCarParkInfo: function() {
    var result = [];
    for (var l in carparkList) {
      result.push({
        name: l,
        longitude: carparkList[l].longitude,
        latitude: carparkList[l].latitude,
        capacity: carparkList[l].capacity
      });
    }
    return result;
  }
};