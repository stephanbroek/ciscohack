var list ={
  'Manchester Picadilly': {
    people: 22025,
    alert: 19000,
    longitude: 53.47738,
    latitude: -2.23091
  },
  'Manchester Victoria': {
    people: 5839,
    alert: 5000,
    longitude: 53.48748,
    latitude: -2.2426
  },
  'Manchester Oxford Road': {
    people: 5211,
    alert: 4800,
    longitude: 53.47404,
    latitude: -2.24199
  },
  'Stockport': {
    people: 3088,
    alert: 2800,
    longitude: 53.408619,
    latitude: -2.162632
  },
  'Bolton': {
    people: 2771,
    alert: 2500,
    longitude: 53.577325,
    latitude: -2.432879
  }
};

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

function getPeople(name, t) {
  return Math.floor((list[name].people) * getProportion(t));
}


module.exports = {
  getList: function() {
    var result = {}, l;
    for (l in list) if (list.hasOwnProperty(l)) {
      result[l] = {
        people: getPeople(l, time),
        longitude: list[l].longitude,
        latitude: list[l].latitude
      }
    }
    time = (time + 1) % 96;
    return result;
  }
};