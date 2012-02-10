(function() {
"use strict";

var proxy = $.AjaxProxy = function(listeners) {
  $.Events.call(this, listeners);
  
  this.proxy = new XMLHttpRequest();
  this.initialize();
};

$.Function.mixin(proxy, $.Events);

(function() {
  
  var defaults = {
    method: 'GET',
    url: 'http://api.soundcloud.com/tracks.json?filter=streamable', //&order=hotness
    query: '',
    headers: {
      // 'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
      'Content-Type': 'text/plain'
    }
  };
  
  this.setAccessToken = function(str) {
    defaults.accessToken = str;
  };
  
  this.setClientId = function(hash) {
    defaults.clientId = hash;
  };
  
  this.initialize = function() {
    this.proxy.onreadystatechange = handleRequestStateChange.bind(this);
  };
  
  this.setHeaders = function(config) {
    for (var c in config) {
      this.proxy.setRequestHeader(c, config[c]);
    }
  };
  
  this.request = function(options) {
    var opts = $.Object.merge(defaults, options);
    var url = opts.url + '&q=' + options.query + '&client_id=' + opts.clientId + '&access_token=' + opts.accessToken;
    
    this.proxy.open(opts.method, url, true);
    this.setHeaders(opts.headers);
    return this.proxy;
  };
  
  this.parse = function(data) {
    if (!Array.isArray(data)) {
      return;
    }
    var results = [];
    
    data.forEach(function(d) {
      results.push({title: d.title, stream_url: d.stream_url});
    });
    
    this.fireEvent('success', [results]);
  };
  
  var handleRequestStateChange = function(e) {
    var response = '';
    
    if (this.proxy.readyState === 4) {
      if (this.proxy.status === 200) {
        response = this.proxy.responseText;
        try {
          response = JSON.parse(response);
        } catch(e){}
      } else {
        throw new Error(this.proxy.statusText);
      }
    }
    
    this.parse(response);
  };
  
}).call($.AjaxProxy.prototype);

})();