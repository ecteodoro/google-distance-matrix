'use strict';

var request = require('request'),
  debug = require('debug')("google:dm"),
  qs = require('qs-google-signature');

var GOOGLE_DISTANCE_API_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?',
  SEPARATOR = '|',

  // free api key
  GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || null,

  // maps for business users key
  GOOGLE_CLIENT_KEY = process.env.GOOGLE_BUSINESS_CLIENT_KEY || null,
  GOOGLE_SIGNATURE_KEY = process.env.GOOGLE_SIGNATURE_KEY || null;


var GoogleDistanceMatrix = function() {
  this.options = {
    origins: null,
    destinations: null,
    mode: 'driving',
    units: 'metric',
    language: 'en',
    avoid: null
  }
  if (GOOGLE_CLIENT_KEY && GOOGLE_SIGNATURE_KEY) {
    debug("Using Business Client/Key pair", GOOGLE_CLIENT_KEY, GOOGLE_SIGNATURE_KEY)
    this.options.client = GOOGLE_CLIENT_KEY;
    this.options.signature = GOOGLE_SIGNATURE_KEY;
  } else {
    debug("Using simple API Key", GOOGLE_API_KEY)
    this.options.key = GOOGLE_API_KEY;
  }
};

function formatLocations(locations) {
  return locations.join(SEPARATOR);
}

function makeRequest(options, callback) {
  debug("request options", options)
  var requestURL = GOOGLE_DISTANCE_API_URL + qs.stringify(options, GOOGLE_DISTANCE_API_URL);
  debug("requestURL", requestURL)
  request(requestURL, function(err, response, data) {
    if (err || response.statusCode != 200) {
      return callback(new Error('Google API request error: ' + data));
    }
    callback(null, JSON.parse(data));
  })
}

GoogleDistanceMatrix.prototype.matrix = function(args, cb) {

  // validate arguments

  if (arguments.length < 3) {
    throw new Error('Invalid number of arguments');
  }
  var callback = arguments[arguments.length - 1];
  if (typeof callback != 'function') {
    throw new Error('Missing callback function');
  }

  // format arguments

  this.options.origins = formatLocations(arguments[0]);
  this.options.destinations = formatLocations(arguments[1]);

  // makes a request to google api

  makeRequest(this.options, function(err, data) {
    if (err) {
      return callback(err);
    }
    return callback(null, data);
  });

}

GoogleDistanceMatrix.prototype.mode = function(mode) {
  if (mode != 'driving' && mode != 'walking' && mode != 'bicycling') {
    throw new Error('Invalid mode: ' + mode);
  }
  this.options.mode = mode;
}

GoogleDistanceMatrix.prototype.language = function(language) {
  this.options.language = language;
}

GoogleDistanceMatrix.prototype.avoid = function(avoid) {
  if (avoid != 'tolls' && avoid != 'highways' && avoid != 'ferries') {
    throw new Error('Invalid restriction: ' + avoid);
  }
  this.options.avoid = avoid;
}

GoogleDistanceMatrix.prototype.units = function(units) {
  if (units != 'metric' && units != 'imperial') {
    throw new Error('Invalid units: ' + units);
  }
  this.options.units = units;
}

GoogleDistanceMatrix.prototype.departure_time = function(departure_time) {
  this.options.departure_time = departure_time;
}

GoogleDistanceMatrix.prototype.key = function(key) {
  delete this.options.client;
  delete this.options.signature;
  this.options.key = key;
}

GoogleDistanceMatrix.prototype.client = function(client) {
  delete this.options.key;
  this.options.client = client;
}

GoogleDistanceMatrix.prototype.signature = function(signature) {
  delete this.options.key;
  this.options.signature = signature;
}

module.exports = new GoogleDistanceMatrix();
