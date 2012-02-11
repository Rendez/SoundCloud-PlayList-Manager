(function() {
"use strict";

var model = $.Model = function(data, options) {
  $.Events.call(this);
  
  this._idProperty = 'id';
  this._values = {};
  
  if (data) {
    if (data instanceof $.Model) {
      data = data.getData();
    }
    var id = data.id;
    
    if (id >= 0) {
      this[this._idProperty] = id;
      delete data.id;
    }
    for (var k in data) {
      this._values[k] = data[k];
    }
  }
};

$.Function.mixin(model, $.Events);

(function() {
  
  // this._internalId = 1;
  
  this.get = function(field) {
    return this._values[field];
  };
  
  this.getData = function() {
    return this._values;
  };
  
  this.getId = function() {
    return this[this._idProperty];
  };
  
  this.getName = function() {
    return this._name;
  };
  
  this.set = function(field, value) {
    this._values[field] = value;
    this.fireEvent('update', this, this.collection);
  };
  
  this.destroy = function() {
    this._values = {};
    this.fireEvent('update', this, this.collection);
  };
  
}).call($.Model.prototype);

})();