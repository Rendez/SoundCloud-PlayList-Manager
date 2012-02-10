(function() {
"use strict";

$.Controller = function(config) {
  this.initConfig(config);
  this.initialize();
};

(function() {
  
  var defaults = {
    //views: [],
    //stores: []
  };
  
  this.initConfig = function(options) {
    var config = $.Object.merge(defaults, options);

    for (var k in config) {
      this[k] = config[k];
    }
    
    if (this.views) {
      var views = {};
      
      this.views.forEach(function(view) {
        views[view] = $[view + 'View'];
      });
      
      this.views = views;
    }
    
    if (this.stores) {
      var stores = {};
      
      this.stores.forEach(function(store) {
        stores[store] = $[store + 'Collection'];
      });
      
      this.stores = stores;
    }
  };
  
  this.getApplication = function() {
    return this.application;
  };
  
  this.getView = function(name) {
    return this.views[name];
  };
  
  this.getCollection = function(name) {
    return this.stores[name];
  };
  
  this.control = function(config) {
    var events = [], delegate, selector, type, parts;
    
    for (selector in config) {
      parts = /^([^\s]*)(.*)$/.exec(selector);
      type = parts[1];
      delegate = parts[2] && parts[2].trim();
      events.push({type: type, delegate: delegate, callback: config[selector]});
    }
    
    return events;
  };
  
}).call($.Controller.prototype);
  
})();