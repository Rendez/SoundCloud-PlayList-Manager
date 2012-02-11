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
  
  this._idsProperty = 'ids';
  
  this.load = function() {
    var key, value, data = [], me = this;
    
    this.range().forEach(function(id) {
      key = me.ns + '-' + id;
      value = me._read(key);
      if (value) data.push(JSON.parse(value));
    });
    
    return data;
  };
  
  this._read = function(key) {
    if (this.proxy[key]) {
      return this.proxy.getItem(key);
    }
    return '';
  };
  
  this._write = function(key, value) {
     this.proxy.setItem(key, value);
  };
  
  this._reset = function() {
    var me = this, key;
    
    this.range().forEach(function(id) {
      key = me.ns + '-' + id;
      delete me.proxy[key];
    });
    delete this.proxy[this.ns + '-' + this._idsProperty];
  };
  
  this.save = function(models) {
    var data, key;
    var me = this;
    var ids = [];
    
    Array.isArray(models) ? models.slice() : [models];
    this._reset();
    
    models.forEach(function(model) {
      data = model.getData();
      data[model._idProperty] = model.getId();
      key = me.ns + '-' + model.getId();
      ids.push(model.getId());
      me._write(key, JSON.stringify(data));
    });
    //if (models.length) {
    this.range(ids);
    //}
  };
  
  this.range = function(range) {
    var key = this.ns + '-' + this._idsProperty;
    
    if (Array.isArray(range)) {
      this._write(key, range.join(','));
    }
    else if (!this.proxy[key]) {
      this._write(key, '');
    }
    
    return this._read(key).split(',');
  };
  
}).call(proxy.prototype);

})();