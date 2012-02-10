(function() {
"use strict";

var model = $.TrackModel = function(data, options) {
  model.superclass.constructor.call(this, data, options);
};

$.Function.inherits(model, $.Model);

(function() {
  
  this._name = 'track';
  
}).call(model.prototype);

})();