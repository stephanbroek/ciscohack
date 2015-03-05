var list ={
  'Manchester Picadilly': {
    people: 22025850,
    longitude: 0,
    latitude: 0
  },
  'Manchester Victoria': {
    people: 5839988,
    longitude: 0,
    latitude: 0
  },
  'Manchester Oxford Road': {
    people: 5211830,
    longitude: 0,
    latitude: 0
  },
  'Stockport': {
    people: 3088032,
    longitude: 0,
    latitude: 0
  },
  'Bolton': {
    people: 2771130,
    longitude: 0,
    latitude: 0
  }
};

module.exports = {
  getLongitudeLatitude: function(name) {
    return [list[name].longitude, list[name].latitude]
  },
  getPeople: function(name, time) {
    return list[name].people / 1000;
  },
  getListNames: function() {
    return Object.keys(list);
  },
  getList: function() {
    return list;
  }
};