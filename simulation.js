var stationList = require('./data/stations.js');
var carparkList = require('./data/carparks.js');

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

var k0 = [0, 16, 32, 40, 48, 60, 72, 80, 96];
var k1 = [.2,.2, 1,.6,.8,.6, 1,.2, 2];

var time = 0;
var proportion = 0;

function getLower(t) {
  for (var ki=0; ki<k0.length; ki++) {
    if (k0[ki] > t)
      return [k0[ki-1], k1[ki-1]];
  }
}

function getHigher(t) {
  for (var ki=0; ki<k0.length; ki++) {
    if (k0[ki] > t)
      return [k0[ki], k1[ki]];
  }
}

function getProportion(t) {
  var io = k0.indexOf(t);
  if (io > -1)
    return k1[io];
  else {
    var lower = getLower(t), higher = getHigher(t);
    var lowerProportion = (t - lower[0]) / (higher[0] - lower[0]), higherProportion = 1 - lowerProportion;
    return lowerProportion * lower[1] + higherProportion * higher[1];
  }
}

function getPeople(name) {
  return Math.floor((stationList[name].people) * proportion);

}

function getSpaces(name) {
  return carparkList[name].capacity - Math.floor(carparkList[name].capacity * proportion);
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

module.exports = {
  getData: function() {
    proportion = getProportion(time);
    time = (time + 1) % 96;
    return {
      stations: getStations(),
      carParks: getCarParks()
    }
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
        latitude: carparkList[l].latitude
      });
    }
    return result;
  }
};