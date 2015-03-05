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

function getPeople(name, ts) {
  var p = Math.sin(ts / 50000);
  return Math.floor((list[name].people) * ((1 + p) / 2));
}

module.exports = {
  getList: function() {
    var result = {}, l, ts = Date.now();
    for (l in list) if (list.hasOwnProperty(l)) {
      result[l] = {
        people: getPeople(l, ts),
        longitude: list[l].longitude,
        latitude: list[l].latitude
      }
    }
    return result;
  }
};