#Node.js wrapper for Google Distance Matrix API

The Google Distance Matrix API is a service that provides travel distance and time for a matrix of origins and destinations. The information returned is based on the recommended route between start and end points, as calculated by the Google Maps API, and consists of rows containing duration and distance values for each pair.

Please refer to [Google Distance Matrix API](https://developers.google.com/maps/documentation/distancematrix/) documentation for further details on **request parameters** and **response format**. 

Unlike similar modules, this one accepts multiple origins and the result data is just like the one returned by the Google API.

##Installation

`npm install google-distance-matrix`

##Usage
```javascript
var distance = require('google-distance-matrix');

var origins = ['San Francisco CA'];
var destinations = ['New York NY', '41.8337329,-87.7321554'];

distance.matrix(origins, destinations, function (err, distances) {
    if (!err)
        console.log(distances);
}
```
##Parameters

###API Key

Please read the [API Key](https://developers.google.com/maps/documentation/distancematrix/#api_key) documentation first.

If using a **key**:

* There are 2 options to define the key:  

1. Create an environment variable `GOOGLE_API_KEY`, or...  
2. Programatically: 
```javascript
distance.key('YOUR-API-KEY');
```

* If using **client** and **signature**:  

1. Create environment variables `GOOGLE_CLIENT_KEY` and `GOOGLE_SIGNATURE_KEY`, or...  
2. Programmatically: 
```javascript
distance.client('YOUR-CLIENT-KEY');
distance.signature('YOUR-SIGNATURE');
```

###Options

Mode (optional): `driving | walking | bicycling`, default `driving`  

```javascript
distance.mode('driving');
```

Language (optional): default `en`

```javascript
distance.language('pt');
```

Avoid (optional): `tolls | highways | ferries`, default: `null`

```javascript
distance.avoid('tolls');
```

Units (optional): `metric | imperial`, default: `metric`

```javascript
distance.units('imperial');
```

Departure time (optional): desired time of departure as seconds since midnight, January 1, 1970 UTC

```javascript
distance.departure_time(1404696787);
```

###Origins
An array of one or more addresses and/or textual latitude/longitude values from which to calculate distance and time. If you pass an address as a string, the service will geocode the string and convert it to a latitude/longitude coordinate to calculate directions. If you pass coordinates, ensure that no space exists between the latitude and longitude values.
```javascript
...
var origins = ['San Francisco CA', '40.7421,-73.9914'];
...
```
###Destinations
An array of one or more addresses and/or textual latitude/longitude values to which to calculate distance and time. If you pass an address as a string, the service will geocode the string and convert it to a latitude/longitude coordinate to calculate directions. If you pass coordinates, ensure that no space exists between the latitude and longitude values.
```javascript
...
var destinations = ['New York NY', 'Montreal', '41.8337329,-87.7321554', 'Honolulu'];
...
```
##Example

```javascript
var distance = require('google-distance-matrix');

var origins = ['San Francisco CA', '40.7421,-73.9914'];
var destinations = ['New York NY', 'Montreal', '41.8337329,-87.7321554', 'Honolulu'];

distance.key('<Your API key here>');
distance.units('imperial');

distance.matrix(origins, destinations, function (err, distances) {
    if (err) {
        return console.log(err);
    }
    if(!distances) {
        return console.log('no distances');
    }
    if (distances.status == 'OK') {
        for (var i=0; i < origins.length; i++) {
            for (var j = 0; j < destinations.length; j++) {
                var origin = distances.origin_addresses[i];
                var destination = distances.destination_addresses[j];
                if (distances.rows[0].elements[j].status == 'OK') {
                    var distance = distances.rows[i].elements[j].distance.text;
                    console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
                } else {
                    console.log(destination + ' is not reachable by land from ' + origin);
                }
            }
        }
    }
});
```