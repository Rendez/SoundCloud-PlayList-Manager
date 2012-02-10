(function() {
"use strict";

var proxy = $.LocalStorageProxy = function(ns) {
  if (!ns) {
    throw new Error('Namespace is necessary. Ideally the model\'s name should be used');
  }
  this.ns = ns;
  this.proxy = localStorage;
};

(function() {
  
  this._countProperty = 'count';
  
  this.load = function() {
    var len, key, value, data = [];
    
    for (var i = 0, len = this.count(); i < len; i++) {
      key = this.ns + '-' + i;
      value = this._read(key);
      if (value) data.push(JSON.parse(value));
    }
    return data;
  };
  
  this._read = function(key) {
    if (this.proxy[key]) {
      return this.proxy.getItem(key);
    }
    return null;
  };
  
  this._write = function(key, value) {
     this.proxy.setItem(key, value);
  };
  
  this._reset = function() {
    var len, key;
    
    for (var i = 0, len = this.count(); i < len; i++) {
      key = this.ns + '-' + i;
      delete this.proxy[key];
    }
  };
  
  this.save = function(models) {
    var data, key;
    var me = this;
    
    this._reset();
    Array.isArray(models) ? models.slice() : [models];
    
    models.forEach(function(model) {
      data = model.getData();
      key = me.ns + '-' + model.id;
      me._write(key, JSON.stringify(data));
    });
    //if (models.length) {
      me.count(models.length);
    //}
  };
  
  this.count = function(count) {
    var key = this.ns + '-' +this._countProperty;
    
    if (!this.proxy[key]) {
      this.proxy.setItem(key, '0');
    }
    if (count && typeof count === 'number') {
      this.proxy.setItem(key, count);
    }
    
    return Number(this.proxy.getItem(key));
  };
  
}).call(proxy.prototype);

})();