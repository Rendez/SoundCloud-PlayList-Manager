(function() {
"use strict";

var model = $.Model = function(data, options) {
  $.Events.call(this);
  
  // if (!this._name) {
  //   if (!(options && options.name)) {
  //     throw new Error('Model needs the first parameter to define options.');
  //   }
  // } else if (options) {
  //   this._name = options.name;
  // }
  
  this._idProperty = 'id';
  this._values = {};
  
  if (data) {
    if (data instanceof $.Model) {
      data = data.getData();
    }
    for (var k in data) {
      this._values[k] = data[k];
    }
    // if (!(this._idProperty in this._values)) {
    //   this._values[this._idProperty] = this._internalId++;
    // }
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