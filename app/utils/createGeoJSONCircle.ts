// Function to create a GeoJSON circle
export const createGeoJSONCircle = (center: any, radiusInFeet: any) => {
  var radiusInMeters = radiusInFeet * 0.3048;
  var points = 64;
  var coords = {
    latitude: center.lat,
    longitude: center.lng,
  };
  var km = radiusInMeters / 1000;

  var ret = [];
  var distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  var distanceY = km / 110.574;

  for (var i = 0; i < points; i++) {
    var theta = (i / points) * (2 * Math.PI);
    var x = distanceX * Math.cos(theta);
    var y = distanceY * Math.sin(theta);

    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [ret],
    },
  };
};
