var https = require('https'),
    URL = require('url'),
    querystring = require('querystring');

var shared;

exports._init = function(_shared) {
    shared = _shared;
    return this;
};

exports._request= function(method, url, headers, post_body, access_token, callback) {

  var parsedUrl= URL.parse( url, true );
  if( parsedUrl.protocol == "https:" && !parsedUrl.port ) parsedUrl.port= 443;
  
  var realHeaders= {};
  if( headers ) {
    for(var key in headers) {
      realHeaders[key] = headers[key];
    }
  }
  realHeaders['Host']= parsedUrl.host;

  realHeaders['Content-Length']= post_body ? Buffer.byteLength(post_body) : 0;
  if( access_token ) {
    if( ! parsedUrl.query ) parsedUrl.query= {};
    parsedUrl.query['access_token']= access_token;
  }

  var result = "";
  var queryStr = querystring.stringify(parsedUrl.query);
  if( queryStr ) queryStr=  "?" + queryStr;
  var options = {
    host:parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname + queryStr,
    method: method,
    headers: realHeaders
  };
  
  var callbackCalled= false;
  function passBackControl( response, result ) {
    if(!callbackCalled) {
      callbackCalled=true;
      if( response.statusCode != 200 ) {
        callback({ statusCode: response.statusCode, data: result });
      } else {
        callback(null, result, response);
      }
    }
  }
  
  shared.Logger.debug("OAuth2 HTTP request: ", options, post_body);

  request = https.request(options, function (response) {
    response.on("data", function (chunk) {
      result+= chunk
    });
    response.on("close", function (err) {
        passBackControl( response, result );
    });
    response.addListener("end", function () {
        passBackControl( response, result );
    });
  });
  request.on('error', function(e) {
    callbackCalled = true;
    callback(e);
  });

  if(  method == 'POST' && post_body ) {
     request.write(post_body);
  }
  request.end();
}

exports.getAccessToken= function(code, callback, error_callback) {
  var params = {};
  params['client_id'] = shared.oAuth2ClientId;
  params['client_secret'] = shared.oAuth2ClientSecret;
  params['grant_type']= 'authorization_code';
  params['redirect_uri']= shared.oAuth2RedirectUri;
  params['code']= code;

  var post_data = querystring.stringify( params );
  var post_headers= {
       'Content-Type': 'application/x-www-form-urlencoded'
  };

  exports._request("POST", shared.oAuth2AccessURL, post_headers, post_data, null, function(error, data, response) {
    if (error) {
        if (typeof error_callback === 'function') {
            error_callback(error);
        }
    } else {
        var results= JSON.parse(data);
        if (typeof callback === 'function') {
            callback({
                access_token: results["access_token"] || null,
                refresh_token: results["refresh_token"] || null
            });
        }
    }
  });
} 

exports.get = function(url, headers, access_token, callback) {
  exports._request("GET", url, headers, "", access_token, callback);
}

exports.post = function(url, post_data, headers, access_token, callback) {
  exports._request("POST", url, headers, JSON.stringify(post_data), access_token, callback);
}

