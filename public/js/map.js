$(document).ready(function() {

    //Read in csv data file
    
    $.ajax({
        type: "GET",
        url: "data/linkDescriptions.csv",
        dataType: "text",
        success: function(data) {displayPoints(data);}
     });



});

function displayPoints(csv) {

    //convert csv to json
    var lines=csv.split("\n");
 
    var result = [];

    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

      var obj = {};
      var currentline=lines[i].split(",");

      for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
      }

      result.push(obj);

    }

    //result is now an array of jsons
    console.log(result);

    //Create a map

    var map = L.map('map').setView([51.505, -0.09], 13);

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);



    //for each result in the array, add a start lat and start lon field then plot it on the map
    for (var i=0; i<result.length; i++) {

        //Convert os grid reference to lat lon
        var osGridStart= result[i].StartGrid;
        var osGridEnd= result[i].EndGrid;
        var osReferenceStart = new OSRef(osGridStart.substring(0,6), osGridStart.substring(6,12));
        var osReferenceEnd = new OSRef(osGridEnd.substring(0,6), osGridEnd.substring(6,12));

        var latLonObjectStart = osReferenceStart.toLatLng();
        var latLonObjectEnd = osReferenceEnd.toLatLng();
        

        L.marker([latLonObjectStart.lat,latLonObjectStart.lng]).addTo(map)
        L.marker([latLonObjectEnd.lat,latLonObjectEnd.lng]).addTo(map)
    }

    //for each result in the array,
    //plot the points on a leaflet map

}