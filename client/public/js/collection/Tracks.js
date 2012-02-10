(function() {
"use strict";

var collection = $.TracksCollection = function(models, options) {
  collection.superclass.constructor.call(this, models, options);
  
  var proxy = options.proxy || (options.proxy = new $.LocalStorageProxy(options.playListId + '-' + options.model.prototype._name));
  
  this.proxy = proxy;
  this.on('sync', this.save.bind(this));
};

$.Function.inherits(collection, $.Collection);

(function() {
  
  this.load = function(options) {
    var me = this;
    
    this.proxy.load().forEach(function(data) {
      me.create(data, options);
    });
    
    //this.fireEvent('load', null, this);
  };
  
  this.save = function() {
    this.proxy.save(this.models);
  };
  
}).call(collection.prototype);

})();